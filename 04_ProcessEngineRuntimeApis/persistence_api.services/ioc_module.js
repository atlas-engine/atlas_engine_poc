const {
  CorrelationService,
  ExternalTaskApiService,
  FlowNodeInstanceService,
  ProcessDefinitionService,
} = require('./dist/commonjs/index');

function registerInContainer(container) {

  container
    .register('CorrelationService', CorrelationService)
    .dependencies('CorrelationRepository', 'IamService', 'ProcessDefinitionRepository');

  container
    .register('ExternalTaskApiService', ExternalTaskApiService)
    .dependencies('ExternalTaskRepository', 'IamService');

  container
    .register('FlowNodeInstanceService', FlowNodeInstanceService)
    .dependencies('FlowNodeInstanceRepository', 'IamService');

  container
    .register('ProcessDefinitionService', ProcessDefinitionService)
    .dependencies('BpmnModelParser', 'IamService', 'ProcessDefinitionRepository');
}

module.exports.registerInContainer = registerInContainer;
