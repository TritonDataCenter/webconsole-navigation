'use strict';

const Brule = require('brule');
const Hapi = require('hapi');
const WebConsole = require('./lib');
const Instana = require('./lib/instana');

const {
  PORT = 3069,
  BASE_URL = `http://0.0.0.0:${PORT}`,
  NODE_ENV = 'develop'
} = process.env;

const server = Hapi.server({
  port: PORT,
  debug: { request: ['error'] }
});

process.on('unhandledRejection', (err) => {
  server.log(['error'], err);
  console.error(err);
});

async function main () {
  Instana.register(NODE_ENV);
  await server.register([
    {
      plugin: Brule,
      options: {
        auth: false
      }
    },
    {
      plugin: WebConsole,
      options: {
        baseUrl: BASE_URL
      }
    }
  ]);

  await server.start();
  console.log(`server started at http://localhost:${server.info.port}`);
}

main();
