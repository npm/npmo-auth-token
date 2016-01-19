var assign = require('lodash.assign')
var redis = require('redis')
var errors = require('./errors')

function Session (opts) {
  assign(this, {
    client: redis.createClient(process.env.LOGIN_CACHE_REDIS),
    sessionLookupPrefix: 'user-',
    tokenPrefix: 'deploy'
  }, opts)
}

Session.prototype.set = function (key, user, cb) {
  key = normalizeKey(key)

  this.client.hmset(this.sessionLookupPrefix + key, user, function (err, result) {
    if (err) return cb(errors.error500())
    return cb(null, result)
  })
}

Session.prototype.get = function (key, cb) {
  key = normalizeKey(key)

  this.client.hgetall(this.sessionLookupPrefix + key, function (err, obj) {
    if (err) return cb(errors.error500())
    if (!obj) return cb(errors.error404())

    return cb(null, obj)
  })
}

Session.prototype.end = function () {
  this.client.end()
}

function normalizeKey (token) {
  return token.replace(/^user-/, '')
}

module.exports = Session
