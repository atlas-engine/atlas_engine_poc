'use strict';

const {
  ProcessModelApiRepository,
  UserTaskApiRepository,
} = require('./dist/commonjs/index');

function registerInContainer(container) {

  container
    .register('ProcessModelApiRepository', ProcessModelApiRepository)
    .dependencies('ExecuteProcessService', 'ProcessModelUseCases')
    .singleton();

  container
    .register('UserTaskApiRepository', UserTaskApiRepository)
    .dependencies('CorrelationService', 'FlowNodeInstanceService', 'ProcessModelUseCases')
    .singleton();
}

module.exports.registerInContainer = registerInContainer;
