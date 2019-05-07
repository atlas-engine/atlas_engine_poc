'use strict'

const DeploymentEndpoint = require('./dist/commonjs/index').Endpoints.Deployment;
const KpiEndpoint = require('./dist/commonjs/index').Endpoints.Kpi;

const routerDiscoveryTag = require('@essential-projects/bootstrapper_contracts').routerDiscoveryTag;

function registerInContainer(container) {

  container.register('ProcessEngineAdminApiDeploymentRouter', DeploymentEndpoint.DeploymentRouter)
    .dependencies('ProcessEngineAdminApiDeploymentController', 'IdentityService')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ProcessEngineAdminApiDeploymentController', DeploymentEndpoint.DeploymentController)
    .dependencies('ProcessEngineAdminApiDeploymentService')
    .singleton();

  container.register('ProcessEngineAdminApiKpiRouter', KpiEndpoint.KpiRouter)
    .dependencies('ProcessEngineAdminApiKpiController', 'IdentityService')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ProcessEngineAdminApiKpiController', KpiEndpoint.KpiController)
    .dependencies('ProcessEngineAdminApiKpiService')
    .singleton();
}

module.exports.registerInContainer = registerInContainer;
