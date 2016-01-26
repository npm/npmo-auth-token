#!/usr/bin/env node

var chalk = require('chalk')
var inquirer = require('inquirer')
var Session = require('../').Session

function generateToken (userInfo) {
  var session = new Session()
  session.generate(userInfo, function (err, token) {
    if (err) {
      console.log(chalk.red(err.message))
    } else {
      console.log('generated token:', chalk.green(token))
    }
    session.end()
  })
}

function deleteToken (session, tokenString) {
  var token = 'user-' + tokenString.split(' ')[0]
  session.client.del(token, function (err) {
    if (err) console.log(chalk.red(err.message))
    else console.log('deleted:', chalk.green(tokenString))
    session.end()
  })
}

require('yargs')
  .usage('$0 <cmd> [options]')
  .option('u', {
    alias: 'user',
    describe: 'Generate a token with this npm username, rather than answering a prompt',
    type: 'string'
  })
  .option('e', {
    alias: 'email',
    describe: 'Generate a token with this email address, rather than answering a prompt',
    type: 'string'
  })
  .option('t', {
    alias: 'token',
    describe: 'Delete a specific token, rather than selecting from a list',
    type: 'string'
  })
  .command('generate', 'Generate a new deploy token (you will be prompted for username and email)', function (yargs, argv) {
    if (argv.user && argv.email) {
      return generateToken({ name: argv.user, email: argv.email })
    }
    inquirer.prompt([
      {
        name: 'name',
        message: 'npm username'
      },
      {
        name: 'email',
        message: 'email address'
      }
    ], generateToken)
  })
  .command('list', 'List all user sessions that exist in npmo', function (yargs, argv) {
    var session = new Session()
    session.allSessions(function (err, sessions) {
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
  .command('delete', 'Delete a token (you will be presented with a list)', function (yargs, argv) {
    var session = new Session()
    if (argv.token) {
      return deleteToken(session, argv.token)
    } else {
      session.allSessions(function (err, sessions) {
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
          return deleteToken(session, answers.delete)
        })
      })
    }
  })
  .demand(1, chalk.red('a command must be provided'))
  .help('h')
  .alias('h', 'help')
  .wrap(96)
  .argv
