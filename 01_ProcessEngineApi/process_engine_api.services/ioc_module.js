'use strict';

const {
  ProcessModelApiService,
  ProcessModelConverter,
  UserTaskApiService,
  UserTaskConverter,
} = require('./dist/commonjs/index');

function registerInContainer(container) {

  container
    .register('ProcessEngineApiUserTaskConverter', UserTaskConverter)
    .dependencies('CorrelationService', 'FlowNodeInstanceService', 'ProcessModelFacadeFactory', 'ProcessModelUseCases', 'ProcessTokenFacadeFactory')
    .singleton();

  container
    .register('ProcessEngineApiProcessModelConverter', ProcessModelConverter)
    .dependencies('ProcessModelFacadeFactory')
    .singleton();

  container
    .register('ProcessModelApiService', ProcessModelApiService)
    .dependencies(
      'ExecuteProcessService',
      'ProcessModelUseCases',
      'ProcessEngineApiProcessModelConverter')
    .singleton();

  container
    .register('UserTaskApiService', UserTaskApiService)
    .dependencies(
      'EventAggregator',
      'FlowNodeInstanceService',
      'ProcessEngineApiUserTaskConverter')
    .singleton();
}

module.exports.registerInContainer = registerInContainer;
