'use strict';

const Brule = require('brule');
const Hapi = require('hapi');
const Api = require('hapi-webconsole-nav');
const Ui = require('my-joy-navigation');
const Sso = require('hapi-triton-auth');
const Instana = require('./instana');

const Regions = require('./data/regions');
const Categories = require('./data/categories');


const {
  PORT = 8080,
  COOKIE_PASSWORD,
  COOKIE_DOMAIN,
  COOKIE_SECURE,
  COOKIE_HTTP_ONLY,
  DC_NAME,
  SDC_KEY_PATH,
  SDC_ACCOUNT,
  SDC_KEY_ID,
  SDC_URL,
  SSO_URL,
  BASE_URL = `http://0.0.0.0:${PORT}`,
  NODE_ENV = 'production',
  NAMESPACE = 'navigation'
} = process.env;

Instana.register(NODE_ENV);


const server = Hapi.server({
  port: PORT
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
      plugin: Sso,
      options: {
        ssoUrl: SSO_URL,
        baseUrl: BASE_URL,
        apiBaseUrl: SDC_URL,
        keyId: '/' + SDC_ACCOUNT + '/keys/' + SDC_KEY_ID,
        keyPath: SDC_KEY_PATH,
        permissions: { cloudapi: ['/my/*'] },
        isDev: NODE_ENV === 'development',
        cookie: {
          isHttpOnly: COOKIE_HTTP_ONLY !== '0',
          isSecure: COOKIE_SECURE !== '0',
          password: COOKIE_PASSWORD,
          ttl: 4000 * 60 * 60,       // 4 hours
          domain: COOKIE_DOMAIN
        }
      }
    },
    {
      plugin: Api,
      options: {
        keyId: '/' + SDC_ACCOUNT + '/keys/' + SDC_KEY_ID,
        keyPath: SDC_KEY_PATH,
        apiBaseUrl: SDC_URL,
        dcName: DC_NAME,
        baseUrl: BASE_URL,
        regions: Regions,
        categories: Categories
      },
      routes: {
        prefix: `/${NAMESPACE}`
      }
    },
    {
      plugin: Ui
    }
  ]);

  server.auth.default('sso');

  await server.start();
  console.log(`server started at http://localhost:${server.info.port}`);
}

main();
