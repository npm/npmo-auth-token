/* global describe it */

var Authenticator = require('../lib/authenticator')
var expect = require('chai').expect

require('chai').should()
require('tap').mochaGlobals()

describe('Authentictor', function () {
  it('should return a 501 if an attempt is made to authenticate', function (done) {
    var authenticator = new Authenticator()
    authenticator.authenticate({user: 'batman'}, function (err, session) {
      err.message.should.match(/deploy tokens must be generated/)
      return done()
    })
  })

  it('should be a noop when unauthenticate is called', function (done) {
    var authenticator = new Authenticator()
    authenticator.unauthenticate({user: 'batman'}, function (err) {
      expect(err).to.equal(null)
      return done()
    })
  })
})
