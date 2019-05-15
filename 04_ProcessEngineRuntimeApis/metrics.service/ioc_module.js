'use strict';

const MetricsApiService = require('./dist/commonjs/index').MetricsApiService;

function registerInContainer(container) {

  container
    .register('MetricsApiService', MetricsApiService)
    .dependencies('MetricsRepository')
    .singleton();
}

module.exports.registerInContainer = registerInContainer;
