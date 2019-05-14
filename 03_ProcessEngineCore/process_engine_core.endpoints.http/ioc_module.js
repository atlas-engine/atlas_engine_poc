'use strict'

const CorrelationsEndpoint = require('./dist/commonjs/index').Endpoints.Correlations;
const FlowNodeInstancesEndpoint = require('./dist/commonjs/index').Endpoints.FlowNodeInstances;
const MetricsEndpoint = require('./dist/commonjs/index').Endpoints.Metrics;
const ProcessModelsEndpoint = require('./dist/commonjs/index').Endpoints.ProcessModels;

const routerDiscoveryTag = require('@essential-projects/bootstrapper_contracts').routerDiscoveryTag;

function registerInContainer(container) {

  container.register('ProcessEngineRuntimeCorrelationsRouter', CorrelationsEndpoint.CorrelationsRouter)
    .dependencies('ProcessEngineRuntimeCorrelationsController', 'IdentityService')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ProcessEngineRuntimeCorrelationsController', CorrelationsEndpoint.CorrelationsController)
    .dependencies('CorrelationApiService')
    .singleton();

  container.register('ProcessEngineRuntimeFlowNodeInstancesRouter', FlowNodeInstancesEndpoint.FlowNodeInstancesRouter)
    .dependencies('ProcessEngineRuntimeFlowNodeInstancesController', 'IdentityService')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ProcessEngineRuntimeFlowNodeInstancesController', FlowNodeInstancesEndpoint.FlowNodeInstancesController)
    .dependencies('FlowNodeInstanceApiService')
    .singleton();

  container.register('ProcessEngineRuntimeMetricsRouter', MetricsEndpoint.MetricsRouter)
    .dependencies('ProcessEngineRuntimeMetricsController', 'IdentityService')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ProcessEngineRuntimeMetricsController', MetricsEndpoint.MetricsController)
    .dependencies('MetricsApiService')
    .singleton();

  container.register('ProcessEngineRuntimeProcessModelsRouter', ProcessModelsEndpoint.ProcessModelsRouter)
    .dependencies('ProcessEngineRuntimeProcessModelsController', 'IdentityService')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ProcessEngineRuntimeProcessModelsController', ProcessModelsEndpoint.ProcessModelsController)
    .dependencies('ProcessModelApiService')
    .singleton();
}

module.exports.registerInContainer = registerInContainer;
