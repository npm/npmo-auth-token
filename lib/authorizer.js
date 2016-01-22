var errors = require('./errors')
var assign = require('lodash.assign')
var Session = require('./session')

function Authorizer (opts) {
  assign(this, {
    session: new Session(opts)
  }, opts)
}

Authorizer.prototype.authorize = Authorizer.prototype.whoami = function (credentials, cb) {
  if (!validateCredentials(credentials)) return cb(errors.error404())
  var token = credentials.headers.authorization.replace('Bearer ', '')
  if (token.indexOf('deploy_') === -1) return cb(errors.error401())
  this.session.get('user-' + token, cb)
}

function validateCredentials (credentials) {
  if (!credentials) return false
  if (!credentials.headers) return false
  if (!credentials.headers.authorization || !credentials.headers.authorization.match(/Bearer /)) return false
  return true
}

Authorizer.prototype.end = function () {
  this.session.end()
}

module.exports = Authorizer
