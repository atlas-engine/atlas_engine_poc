'use strict';

const {
  ProcessModelApiService,
  UserTaskApiService,
} = require('./dist/commonjs/index');

function registerInContainer(container) {

  container
    .register('ProcessModelApiService', ProcessModelApiService)
    .dependencies('ProcessModelApiRepository')
    .singleton();

  container
    .register('UserTaskApiService', UserTaskApiService)
    .dependencies('UserTaskApiRepository')
    .singleton();
}

module.exports.registerInContainer = registerInContainer;
