/* global describe it */

var Session = require('../lib/session')
var expect = require('chai').expect

require('chai').should()
require('tap').mochaGlobals()

describe('Session', function () {
  var prefixedKey = 'user-abc123'

  it('allows a session to be set', function (done) {
    var session = new Session()
    session.set(prefixedKey, {email: 'ben@example.com', name: 'ben'}, function (err) {
      expect(err).to.equal(null)
      session.client.hgetall(prefixedKey, function (err, obj) {
        expect(err).to.equal(null)
        obj.email.should.equal('ben@example.com')
        session.client.del(prefixedKey)
        session.end()
        return done()
      })
    })
  })

  it('allows a session to be fetched', function (done) {
    var session = new Session()
    session.set(prefixedKey, {email: 'ben3@example.com', name: 'ben'}, function (err) {
      expect(err).to.equal(null)
      session.get(prefixedKey, function (err, obj) {
        expect(err).to.equal(null)
        obj.email.should.equal('ben3@example.com')
        session.client.del(prefixedKey)
        session.end()
        return done()
      })
    })
  })

  it('returns a 404 error if session is missing', function (done) {
    var session = new Session()
    session.get('pork-chop-sandwiches', function (err, obj) {
      err.statusCode.should.equal(404)
      session.end()
      return done()
    })
  })

  it('returns a 500 error if something really strange happens', function (done) {
    var session = new Session()
    session.client.end()
    session.get('pork-chop-sandwiches', function (err, obj) {
      err.statusCode.should.equal(500)
      return done()
    })
  })
})
