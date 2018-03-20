'use strict';

const Lab = require('lab');
const td = require('testdouble');

const lab = exports.lab = Lab.script();
const { describe, it, afterEach, beforeEach } = lab;

describe('instana tests', () => {
  let instana;
  let Instana;
  beforeEach(() => {
    instana = td.replace('instana-nodejs-sensor');
    Instana = require('../lib/instana');
  });

  afterEach(() => {
    td.reset();
  });

  it('does not run instana in develop mode', () => {
    Instana.register('develop');
    td.verify(instana(), { times: 0 });
  });

  it('does run instana in production mode', () => {
    Instana.register('production');
    td.verify(instana(), { times: 1 });
  });
});
