'use strict';

const Fs = require('fs');
const Path = require('path');
const Consul = require('consul');
const Graphi = require('graphi');
const Hoek = require('hoek');
const Package = require('../package.json');
const Routes = require('./routes');

const Schema = Fs.readFileSync(Path.join(__dirname, '/schema.graphql'));
const defaults = {
  consul: {
    host: '127.0.0.1',
    port: '8500',
    ca: [],
    promisify: true
  }
};


const graphqlHandler = function (route, options) {
  Hoek.assert(typeof options.method === 'function', 'method must be a function');

  return function (request, h) {
    return options.method(request.plugins.consul, request.payload, request);
  };
};

const register = async (server, options = {}) => {
  Hoek.assert(options.baseUrl, 'options.baseUrl is required');
  const settings = Hoek.applyToDefaults(defaults, options);

  server.plugins.consul = Consul(settings.consul);
  server.decorate('handler', 'graphql', graphqlHandler);
  server.decorate('request', 'baseUrl', settings.baseUrl);
  server.route(Routes);

  const graphiOptions = {
    schema: Schema,
    authStrategy: settings.authStrategy
  };

  await server.register({ plugin: Graphi, options: graphiOptions });
};

module.exports = {
  pkg: Package,
  register
};
