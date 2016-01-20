#!/usr/bin/env node

var eachLimit = require('async').eachLimit
var chalk = require('chalk')
var inquirer = require('inquirer')
var Session = require('../').Session

require('yargs')
  .usage('$0 <cmd> [options]')
  .command('generate', 'generate a new deploy token', function (yargs, argv) {
    inquirer.prompt([
      {
        name: 'name',
        message: 'npm username'
      },
      {
        name: 'email',
        message: 'email address'
      }
    ], function (answers) {
      var session = new Session()
      session.generate(answers, function (err, token) {
        if (err) {
          console.log(chalk.red(err.message))
        } else {
          console.log('generated token:', chalk.green(token))
        }
        session.end()
      })
    })
  })
  .command('list', 'list all user sessions that exist in npmo', function (yargs, argv) {
    var session = new Session()
    getAllSessions(session.client, function (err, sessions) {
      if (err) {
        console.log(chalk.red(err.message))
        return session.end()
      }

      if (!sessions.length) {
        console.log(chalk.green('no sessions exist'))
        return session.end()
      }

      sessions.forEach(function (s) {
        console.log(s.key.replace('user-', '') + ' ' + s.name)
      })
      session.end()
    })
  })
  .command('delete', 'delete a token (you will be presented with a list)', function (yargs, argv) {
    var session = new Session()
    getAllSessions(session.client, function (err, sessions) {
      if (err) {
        console.log(chalk.red(err.message))
        return session.end()
      }

      if (!sessions.length) {
        console.log(chalk.green('no sessions exist'))
        return session.end()
      }

      inquirer.prompt([{
        type: 'list',
        message: 'select the token you wish to delete',
        name: 'delete',
        choices: sessions.map(function (s) {
          return s.key.replace('user-', '') + ' ' + s.name
        })
      }], function (answers) {
        var token = 'user-' + answers.delete.split(' ')[0]
        session.client.del(token, function (err) {
          if (err) console.log(chalk.red(err.message))
          console.log('deleted:', chalk.green(answers.delete))
          session.end()
        })
      })
    })
  })
  .demand(1, 'a command must be provided')
  .help('h')
  .alias('h', 'help')
  .argv

function getAllSessions (client, cb) {
  var sessions = []

  client.keys('user-*', function (err, keys) {
    if (err) return cb(err)
    eachLimit(keys, 4, function (key, done) {
      var session = {
        key: key
      }
      client.hgetall(key, function (err, res) {
        if (err) return done(err)
        session.email = res.email
        session.name = res.name
        sessions.push(session)
        return done()
      })
    }, function (err) {
      if (err) return cb(err)
      return cb(null, sessions)
    })
  })
}
