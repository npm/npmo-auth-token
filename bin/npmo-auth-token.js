#!/usr/bin/env node

var chalk = require('chalk')
var inquirer = require('inquirer')
var Session = require('../').Session

require('yargs')
  .usage('$0 <cmd> [options]')
  .option('token', {
    alias: 't',
    describe: 'delete a specific token, rather than selecting from a list'
  })
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
  .command('delete', 'delete a token (you will be presented with a list)', function (yargs, argv) {
    var session = new Session()
    if (argv.token) {
      session.client.del('user-' + argv.token, function (err) {
        if (err) console.log(chalk.red(err.message))
        console.log('deleted:', chalk.green(argv.token))
        session.end()
      })
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
          var token = 'user-' + answers.delete.split(' ')[0]
          session.client.del(token, function (err) {
            if (err) console.log(chalk.red(err.message))
            console.log('deleted:', chalk.green(answers.delete))
            session.end()
          })
        })
      })
    }
  })
  .demand(1, 'a command must be provided')
  .help('h')
  .alias('h', 'help')
  .argv
