# webconsole-console

[![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0) [![Build Status](https://secure.travis-ci.org/joyent/webconsole-console.svg)](http://travis-ci.org/joyent/webconsole-console)


hapi plugin that exposes web console navigation resources through [GraphQL](http://graphql.org).

## Table of Contents

* [Install](#install)
* [Options](#options)
* [Usage](#usage)

## Install

```
npm install webconsole-console
```

## Options

- `authStrategy`: name of the hapi auth strategy to use for `/graphql` route
- `baseUrl`: required base URL of the datacenter where the current console is running
- `consul`: object with configuration details for connecting to the local consul agent
  - `host`: agent host address, defaults to '127.0.0.1'
  - `port`: agent port, defaults to '8500'
  - `secure`: enable HTTPS, disabled by default
  - `ca`: string array of trusted certificates in PEM format


## Usage

```js
const server = new Hapi.Server();
await server.register({ plugin: WebConsole, options: { authStrategy, baseUrl: 'https://us-west.site.com' } });
```


### Local development

```
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
