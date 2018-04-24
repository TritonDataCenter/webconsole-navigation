'use strict';

const { join } = require('path');

const Blankie = require('blankie');
const Brule = require('brule');
const Hapi = require('hapi');
const HapiPino = require('hapi-pino');
const Sso = require('hapi-triton-auth');
const Api = require('hapi-webconsole-nav');
const Inert = require('inert');
const Ui = require('my-joy-navigation');
const Scooter = require('scooter');

const dataPath = process.env.DATA_PATH || './data';
const AccountServices = require(`${dataPath}/accounts`);
const Categories = require(`${dataPath}/categories`);
const Regions = require(`${dataPath}/regions`);


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
  NAMESPACE = 'navigation',
  NODE_ENV = 'development'
} = process.env;

const server = Hapi.server({
  port: PORT,
  routes: {
    security: {
      hsts: true,
      xframe: 'deny',
      xss: true,
      noOpen: true,
      noSniff: true
    }
  }
});

process.on('unhandledRejection', (err) => {
  server.log(['error'], err);
});

async function main () {
  try {
    await server.register([
      {
        plugin: Brule,
        options: {
          auth: false
        }
      },
      {
        plugin: Inert
      },
      {
        plugin: Scooter
      },
      {
        plugin: Blankie.plugin,
        options: {
          defaultSrc: ['self'],
          imgSrc: '*',
          scriptSrc: ['self', 'unsafe-inline', 'http://unpkg.com', 'http://cdn.jsdelivr.net'],
          styleSrc: ['self', 'unsafe-inline', 'http://unpkg.com'],
          generateNonces: false
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
          categories: Categories,
          accountServices: AccountServices
        },
        routes: {
          prefix: `/${NAMESPACE}`
        }
      },
      {
        plugin: Ui
      },
      {
        plugin: HapiPino,
        options: {
          prettyPrint: NODE_ENV !== 'production'
        }
      }
    ]);

    server.auth.default('sso');

    server.route({
      method: 'get',
      path: `/${NAMESPACE}/versions`,
      config: {
        auth: false,
        handler: {
          file: {
            path: join(__dirname, 'versions.json')
          }
        }
      }
    });

    server.route({
      method: 'GET',
      path: `/${NAMESPACE}/logout`,
      handler: (request, h) => {
        return h.response('<script>location.href="/"</script>').unstate('sso');
      }
    });

    await server.start();
  } catch (err) {
    console.error(err);
  }
}

main();
