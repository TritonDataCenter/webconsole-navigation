'use strict';

const Lab = require('lab');
const TestDouble = require('testdouble');

const lab = exports.lab = Lab.script();
const { describe, it, afterEach, beforeEach } = lab;

describe('instana tests', () => {
  let instana;
  let Instana;
  beforeEach(() => {
    instana = TestDouble.replace('instana-nodejs-sensor');
    Instana = require('../instana');
  });

  afterEach(() => {
    TestDouble.reset();
  });

  it('does not run instana in develop mode', () => {
    Instana.register('develop');
    TestDouble.verify(instana(), { times: 0 });
  });

  it('does run instana in production mode', () => {
    Instana.register('production');
    TestDouble.verify(instana(), { times: 1 });
  });
});
