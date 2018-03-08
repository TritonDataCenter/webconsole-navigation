'use strict';

const Assert = require('assert');
const Consul = require('consul');

const {
  NAV_CATEGORIES,
  NAV_DATACENTERS
} = process.env;

Assert(NAV_CATEGORIES, 'NAV_CATEGORIES env variable is required for setup');
Assert(NAV_DATACENTERS, 'NAV_DATACENTERS env variable is required for setup');

const main = async () => {
  const consul = new Consul({
    host: '127.0.0.1',
    port: '8500',
    ca: [],
    promisify: true
  });

  // Store categories entry if it doesn't already exist
  try {
    const result = await consul.kv.get('categories');
    if (!result || !result.Value) {
      await consul.kv.set('categories', NAV_CATEGORIES);
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  // Store datacenters entry if it doesn't already exist
  try {
    const result = await consul.kv.get('datacenters');
    if (!result || !result.Value) {
      await consul.kv.set('datacenters', NAV_DATACENTERS);
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  process.exit();
};

main();
