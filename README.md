# npmo-auth-token

[![Build Status](https://travis-ci.org/npm/npmo-auth-token.svg)](https://travis-ci.org/npm/npmo-auth-token)
[![Coverage Status](https://coveralls.io/repos/npm/npmo-auth-token/badge.svg?branch=master)](https://coveralls.io/r/npmm/npmo-auth-token?branch=master)

Token based authentication, ideal for CI servers.

## Usage

Generate a token, with prompts for username and email address:

```sh
npmo-auth-token generate
```

Generate a token, without prompts:

```sh
npmo-auth-token generate --user me --email me@me.co
```

List your tokens:

```sh
npmo-auth-token list
```

Delete a token, with prompt to select from a list:

```sh
npmo-auth-token delete
```

Delete a token, without prompt:

```sh
npmo-auth-token delete --token deploy_0609bae9-cbcb-4bd6-a69c-3fae1a49fabd
```

## License

ISC
