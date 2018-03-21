'use strict';

const Lab = require('lab');
const TestDouble = require('testdouble');

const lab = exports.lab = Lab.script();
const { describe, it, afterEach } = lab;

describe('instana', () => {
  afterEach(() => {
    TestDouble.reset();
  });

  it('does not run instana in development mode', () => {
    const instana = TestDouble.replace('instana-nodejs-sensor');
    const Instana = require('../instana');
    Instana.register('development');
    TestDouble.verify(instana(), { times: 0 });
  });

  it('does run instana in production mode', () => {
    const instana = TestDouble.replace('instana-nodejs-sensor');
    const Instana = require('../instana');
    Instana.register('production');
    TestDouble.verify(instana(), { times: 1 });
  });
});
