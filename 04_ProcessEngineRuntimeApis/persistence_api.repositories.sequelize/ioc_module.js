'use strict';

const disposableDiscoveryTag = require('@essential-projects/bootstrapper_contracts').disposableDiscoveryTag;

const {
  CorrelationRepository,
  ExternalTaskRepository,
  FlowNodeInstanceRepository,
  ProcessDefinitionRepository,
} = require('./dist/commonjs/index');

function registerInContainer(container) {

  container.register('CorrelationRepository', CorrelationRepository)
    .dependencies('SequelizeConnectionManager')
    .configure('process_engine:correlation_repository')
    .tags(disposableDiscoveryTag)
    .singleton();

  container.register('ExternalTaskRepository', ExternalTaskRepository)
    .dependencies('SequelizeConnectionManager')
    .configure('process_engine:external_task_repository')
    .tags(disposableDiscoveryTag)
    .singleton();

  container.register('FlowNodeInstanceRepository', FlowNodeInstanceRepository)
    .dependencies('SequelizeConnectionManager')
    .configure('process_engine:flow_node_instance_repository')
    .tags(disposableDiscoveryTag)
    .singleton();

  container.register('ProcessDefinitionRepository', ProcessDefinitionRepository)
    .dependencies('SequelizeConnectionManager')
    .configure('process_engine:process_model_repository')
    .tags(disposableDiscoveryTag)
    .singleton();
}

module.exports.registerInContainer = registerInContainer;
