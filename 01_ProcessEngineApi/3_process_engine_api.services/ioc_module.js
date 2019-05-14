'use strict';

const {
  ProcessModelApiService,
  ProcessModelConverter,
  UserTaskApiService,
  UserTaskConverter,
} = require('./dist/commonjs/index');

function registerInContainer(container) {

  container
    .register('ProcessEngineApiProcessModelConverter', ProcessModelConverter)
    .dependencies('ProcessModelFacadeFactory')
    .singleton();

  container
    .register('ProcessEngineApiUserTaskConverter', UserTaskConverter)
    .dependencies('UserTaskApiRepository', 'ProcessModelFacadeFactory', 'ProcessTokenFacadeFactory')
    .singleton();

  container
    .register('ProcessModelApiService', ProcessModelApiService)
    .dependencies('ProcessEngineApiProcessModelConverter', 'ProcessModelApiRepository')
    .singleton();

  container
    .register('UserTaskApiService', UserTaskApiService)
    .dependencies('EventAggregator', 'ProcessEngineApiUserTaskConverter', 'UserTaskApiRepository')
    .singleton();
}

module.exports.registerInContainer = registerInContainer;
