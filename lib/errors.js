module.exports = {
  error500: function (msg) {
    var error = Error(msg || 'unknown error')
    error.statusCode = 500
    return error
  },
  error404: function (msg) {
    var error = Error(msg || 'not found')
    error.statusCode = 404
    return error
  },
  error501: function (msg) {
    var error = Error(msg || 'deploy tokens must be generated using the npmo CLI on the remote server.')
    error.statusCode = 501
    return error
  }
}
