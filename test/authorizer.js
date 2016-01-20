/* global describe it */

var Authorizer = require('../lib/authorizer')
var expect = require('chai').expect

require('chai').should()
require('tap').mochaGlobals()

describe('Authorizer', function () {
  var token = 'abc123'
  var tokenWithPrefix = 'user-' + token

  it('returns a 404 if an invalid credentials object is provided', function () {
    var authorizer = new Authorizer()
    authorizer.authorize({}, function (err) {
      err.statusCode.should.equal(404)
      authorizer.end()
    })
  })

  it('returns a session if an appropriate bearer token is provided', function () {
    var authorizer = new Authorizer()
    authorizer.session.set(tokenWithPrefix, {
      name: 'bcoe',
      email: 'ben@example.com'
    }, function (err) {
      expect(err).to.equal(null)
      authorizer.authorize({
        headers: {
          authorization: 'Bearer ' + token
        }
      }, function (err, session) {
        expect(err).to.equal(null)
        session.should.deep.equal({
          name: 'bcoe',
          email: 'ben@example.com'
        })
        authorizer.end()
      })
    })
  })

  it('returns a 500 if something really strange happens', function () {
    var authorizer = new Authorizer()
    authorizer.session.set(tokenWithPrefix, {
      name: 'bcoe',
      email: 'ben@example.com'
    }, function (err) {
      authorizer.end()
      expect(err).to.equal(null)
      authorizer.authorize({
        headers: {
          authorization: 'Bearer ' + token
        }
      }, function (err, session) {
        expect(err.statusCode).to.equal(500)
      })
    })
  })
})
