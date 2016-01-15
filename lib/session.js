var assign = require('lodash.assign')
var redis = require('redis')

function Session (opts) {
  assign(this, {
    client: redis.createClient(process.env.LOGIN_CACHE_REDIS),
    sessionLookupPrefix: 'user-',
    tokenPrefix: 'deploy'
  }, opts)
}

Session.prototype.end = function () {
  this.client.end()
}

module.exports = Session
