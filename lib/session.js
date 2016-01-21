var assign = require('lodash.assign')
var eachLimit = require('async').eachLimit
var redis = require('redis')
var errors = require('./errors')
var uuid = require('uuid')

function Session (opts) {
  assign(this, {
    client: redis.createClient(process.env.LOGIN_CACHE_REDIS),
    tokenPrefix: 'deploy_'
  }, opts)
}

Session.prototype.set = function (key, user, cb) {
  this.client.hmset(key, user, function (err, result) {
    if (err) return cb(errors.error500())
    return cb(null, result)
  })
}

Session.prototype.get = function (key, cb) {
  this.client.hgetall(key, function (err, obj) {
    if (err) return cb(errors.error500())
    if (!obj) return cb(errors.error404())

    return cb(null, obj)
  })
}

Session.prototype.generate = function (user, cb) {
  var key = this.tokenPrefix + uuid.v4()
  this.set('user-' + key, user, function (err) {
    if (err) return cb(err)
    return cb(null, key)
  })
}

Session.prototype.allSessions = function (cb) {
  var _this = this
  var sessions = []

  this.client.keys('user-*', function (err, keys) {
    if (err) return cb(err)
    eachLimit(keys, 4, function (key, done) {
      var session = {
        key: key
      }

      _this.client.type(key, function (err, type) {
        if (err) return done(err)
        var method = 'hgetall'
        if (type === 'string') method = 'get'
        _this.client[method](key, function (err, res) {
          if (err) return done(err)
          if (type === 'string') res = JSON.parse(res)
          session.email = res.email
          session.name = res.name
          sessions.push(session)
          return done()
        })
      })
    }, function (err) {
      if (err) return cb(err)
      return cb(null, sessions)
    })
  })
}

Session.prototype.end = function () {
  this.client.end()
}

module.exports = Session
