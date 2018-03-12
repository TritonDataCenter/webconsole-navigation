# webconsole-navigation

[![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0) [![Build Status](https://secure.travis-ci.org/joyent/webconsole-navigation.svg)](http://travis-ci.org/joyent/webconsole-navigation)


hapi plugin and server that exposes web console navigation resources through [GraphQL](http://graphql.org).

## Table of Contents

* [Setup](#setup)
* [Install](#install)
* [Plugin Options](#plugin-options)

## Setup

Run `./setup.sh` to generate the local `_env` file for use with docker.


## Install

The service can be installed and started on Triton using:

`triton-compose up -d`

or locally with

`docker-compose -f local-compose.yml up -d`


## Plugin Options

- `authStrategy`: name of the hapi auth strategy to use for `/graphql` route
- `baseUrl`: required base URL of the datacenter where the current console is running
- `consul`: object with configuration details for connecting to the local consul agent
  - `host`: agent host address, defaults to '127.0.0.1'
  - `port`: agent port, defaults to '8500'
  - `secure`: enable HTTPS, disabled by default
  - `ca`: string array of trusted certificates in PEM format


### Plugin Usage

```js
const server = new Hapi.Server();
await server.register({ plugin: WebConsole, options: { authStrategy, baseUrl: 'https://us-west.site.com' } });
```


### Local development

```
cd app
npm run dev
```

* [GraphiQL](http://0.0.0.0:4000/graphiql)
* [Graphidoc](http://0.0.0.0:4000/doc)
* [Voyager](http://0.0.0.0:4000/voyager)
* [Playground](http://0.0.0.0:4000/playground)

![](https://cldup.com/StGgfIbD3N.png) ![](https://cldup.com/fhpul_AJ13.png)
![](https://cldup.com/A-VwSbvWBe.png) ![](https://cldup.com/08P360Skhx.png)

```
npm run faker
```

* [GraphQL Faker Interactive Editor](http://0.0.0.0:9002/editor)
* [GraphQL Faker API](http://0.0.0.0:9002/graphql)

![](https://cldup.com/VWadVMorQ0.png)
