const {
  CorrelationService,
  ExternalTaskApiService,
  FlowNodeInstanceService,
  ProcessModelService,
} = require('./dist/commonjs/index');

function registerInContainer(container) {

  container
    .register('CorrelationService', CorrelationService)
    .dependencies('CorrelationRepository', 'IamService', 'ProcessDefinitionRepository');

  container
    .register('ExternalTaskApiService', ExternalTaskApiService)
    .dependencies('EventAggregator', 'ExternalTaskRepository', 'IamService');

  container
    .register('FlowNodeInstanceService', FlowNodeInstanceService)
    .dependencies('FlowNodeInstanceRepository', 'IamService');

  container
    .register('ProcessModelService', ProcessModelService)
    .dependencies('BpmnModelParser', 'IamService', 'ProcessDefinitionRepository');
}

module.exports.registerInContainer = registerInContainer;
