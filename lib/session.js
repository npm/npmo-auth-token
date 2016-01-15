var assign = require('lodash.assign')
var redis = require('redis')

function Session (opts) {
  assign({
    client: redis.createClient(process.env.LOGIN_CACHE_REDIS),
    sessionLookupPrefix: 'user-',
    tokenPrefix: 'deploy'
  }, opts)
}

module.exports = Session
