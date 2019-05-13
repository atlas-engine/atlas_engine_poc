'use strict';

const {DeploymentApiService, KpiApiService} = require('./dist/commonjs/index');

function registerInContainer(container) {

  container
    .register('DeploymentApiService', DeploymentApiService)
    .dependencies('ProcessModelUseCases')
    .singleton();

  container
    .register('KpiApiService', KpiApiService)
    .dependencies('FlowNodeInstanceService', 'MetricsRepository')
    .singleton();
}

module.exports.registerInContainer = registerInContainer;
