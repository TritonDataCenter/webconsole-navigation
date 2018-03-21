'use strict';

const Brule = require('brule');
const Hapi = require('hapi');
const Fs = require('fs');
const Path = require('path');
const Graphi = require('graphi');
const Hoek = require('hoek');

process.on('unhandledRejection', err => {
  server.log(['error'], err);
  console.error(err);
});

const { PORT = 3068, BASE_URL = `http://0.0.0.0:${PORT}` } = process.env;

const Schema = Fs.readFileSync(
  Path.join(__dirname, 'app/lib/schema.graphql')
).toString();

const Datacenters = [];
const Categories = [];

const routes = [
  {
    path: '/datacenters',
    method: 'graphql',
    handler: {
      graphql: {
        method: async (...[, , request]) => {
          return Datacenters;
        }
      }
    }
  },
  {
    path: '/categories',
    method: 'graphql',
    handler: {
      graphql: {
        method: async (...[, , request]) => {
          return Categories.map(category => {
            return {
              name: category.name,
              slug: category.slug || category.name.toLowerCase(),
              products: category.products.map(product => {
                return {
                  name: product.name,
                  description: product.description,
                  url: product.url || request.baseUrl + product.path
                };
              })
            };
          });
        }
      }
    }
  },
  {
    path: '/service',
    method: 'graphql',
    handler: {
      graphql: {
        method: async (...[, , request]) => {
          const { slug } = request.payload;

          return Categories
            .reduce((sum, { products }) => sum.concat(products), [])
            .find(product => product.slug === slug);
        }
      }
    }
  }
];

const WebConsole = {
  register: async (server, options = {}) => {
    const settings = Hoek.applyToDefaults(defaults, options);

    server.plugins.consul = Consul(settings.consul);

    server.route(routes);
    server.decorate('request', 'baseUrl', settings.baseUrl);
    server.decorate('handler', 'graphql', function(route, options) {
      return function(request, h) {
        return options.method(
          request.server.plugins.consul,
          request.payload,
          request
        );
      };
    });

    const schema = Graphi.makeExecutableSchema({
      schema: Schema
    });

    const graphiOptions = {
      schema,
      authStrategy: settings.authStrategy
    };

    await server.register({
      plugin: Graphi,
      options: graphiOptions
    });

    const setupCloudApi = ({ keyId, key, apiBaseUrl }) => {
      return (request, h) => {
        if (request.route.settings.auth === false) {
          return h.continue;
        }

        request.plugins.cloudapi = new CloudApi({
          token:
            request.auth &&
            request.auth.credentials &&
            request.auth.credentials.token,
          url: apiBaseUrl,
          keyId,
          key,
          log: request.log.bind(request)
        });

        return h.continue;
      };
    };
  }
};

const server = Hapi.server({
  port: PORT,
  debug: {
    request: ['error']
  }
});

async function main() {
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
