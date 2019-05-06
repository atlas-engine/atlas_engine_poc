'use strict'

const {
  ProcessEngineApiRouter,
  ProcessEngineApiController,
} = require('./dist/commonjs/index');

const routerDiscoveryTag = require('@essential-projects/bootstrapper_contracts').routerDiscoveryTag;

function registerInContainer(container) {
  container.register('ProcessEngineApiRouter', ProcessEngineApiRouter)
    .dependencies('ProcessEngineApiController', 'IdentityService')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ProcessEngineApiController', ProcessEngineApiController)
    .dependencies('ProcessEngineApiService')
    .singleton();
}

module.exports.registerInContainer = registerInContainer;
