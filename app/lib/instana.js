'use strict';

const Instana = require('instana-nodejs-sensor');

module.exports = {
  register: (NODE_ENV) => {
    if (NODE_ENV === 'production') {
      Instana();
    }
  }
};


