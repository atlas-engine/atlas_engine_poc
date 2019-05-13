'use strict';

const {
  ProcessModelApiRepository,
  ProcessModelConverter,
  UserTaskApiRepository,
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
    .register('ProcessModelApiRepository', ProcessModelApiRepository)
    .dependencies(
      'ExecuteProcessService',
      'ProcessModelUseCases',
      'ProcessEngineApiProcessModelConverter')
    .singleton();

  container
    .register('UserTaskApiRepository', UserTaskApiRepository)
    .dependencies(
      'EventAggregator',
      'FlowNodeInstanceService',
      'ProcessEngineApiUserTaskConverter')
    .singleton();
}

module.exports.registerInContainer = registerInContainer;
