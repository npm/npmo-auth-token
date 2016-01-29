var errors = require('./errors')

function Authenticator () {}

Authenticator.prototype.authenticate = function (credentials, cb) {
  process.nextTick(function () {
    return cb(errors.error501())
  })
}

// npm-auth-ws deletes the token stored in redis, this
// API endpoint is only required if additional special
// cleanup is needed.
Authenticator.prototype.unauthenticate = function (token, cb) {
  process.nextTick(function () {
    return cb(null)
  })
}

module.exports = Authenticator
