'use strict'

const KpiEndpoint = require('./dist/commonjs/index').Endpoints.Kpi;

const routerDiscoveryTag = require('@essential-projects/bootstrapper_contracts').routerDiscoveryTag;

function registerInContainer(container) {

  container.register('ProcessEngineAdminApiKpiRouter', KpiEndpoint.KpiRouter)
    .dependencies('ProcessEngineAdminApiKpiController', 'IdentityService')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ProcessEngineAdminApiKpiController', KpiEndpoint.KpiController)
    .dependencies('ProcessEngineAdminApiKpiService')
    .singleton();
}

module.exports.registerInContainer = registerInContainer;
