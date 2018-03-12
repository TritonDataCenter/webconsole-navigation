'use strict';

const Instana = require('instana-nodejs-sensor');
Instana();

const Brule = require('brule');
const Hapi = require('hapi');
const Navigation = require('hapi-webconsole-nav');
const Instana = require('./instana');
const Categories = require('./data/categories');
const Datacenters = require('./data/datacenters');


const {
  PORT = 8080,
  NODE_ENV = 'production'
} = process.env;

Instana.register(NODE_ENV);


const server = Hapi.server({
  port: PORT,
  debug: { request: ['error'] }
});

process.on('unhandledRejection', (err) => {
  server.log(['error'], err);
  console.error(err);
});

async function main () {
  await server.register([
    {
      plugin: Brule,
      options: {
        auth: false
      }
    },
    {
      plugin: Navigation,
      options: {
        datacenters: Datacenters,
        categories: Categories
      }
    }
  ]);

  await server.start();
  console.log(`server started at http://localhost:${server.info.port}`);
}

main();
