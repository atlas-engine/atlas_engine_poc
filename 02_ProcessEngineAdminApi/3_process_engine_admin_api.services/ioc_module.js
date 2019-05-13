'use strict';

const {DeploymentApiService, KpiApiService} = require('./dist/commonjs/index');

function registerInContainer(container) {

  container
    .register('DeploymentApiService', DeploymentApiService)
    .dependencies('DeploymentApiRepository')
    .singleton();

  container
    .register('KpiApiService', KpiApiService)
    .dependencies('KpiApiRepository')
    .singleton();
}

module.exports.registerInContainer = registerInContainer;
