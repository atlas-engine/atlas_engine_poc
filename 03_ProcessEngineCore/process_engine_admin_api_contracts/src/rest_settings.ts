// tslint:disable:typedef
const params = {
  correlationId: ':correlation_id',
  emptyActivityInstanceId: ':empty_activity_instance_id',
  eventName: ':event_name',
  flowNodeId: ':flow_node_id',
  processDefinitionsName: ':process_definitions_name',
  processModelId: ':process_model_id',
  processInstanceId: ':process_instance_id',
  startEventId: ':start_event_id',
  userTaskInstanceId: ':user_task_instance_id',
  manualTaskInstanceId: ':manual_task_instance_id',
  manualTaskId: ':manual_task_id',
};

const queryParams = {
  correlationId: 'correlation_id',
  startEventId: 'start_event_id',
  endEventId: 'end_event_id',
};

const paths = {
  // Deployment
  importProcessModel: `/import_process_model`,
  undeployProcessModel: `/undeploy_process_model/${params.processModelId}`,
  // KPI
  getRuntimeInformationForProcessModel: `/process_model/${params.processModelId}/runtime_information`,
  getActiveTokensForProcessModel: `/process_model/${params.processModelId}/active_tokens`,
  getActiveTokensForCorrelationAndProcessModel: `/correlation/${params.correlationId}/process_model/${params.processModelId}/active_tokens`,
  getActiveTokensForProcessInstance: `/process_instance/${params.processInstanceId}/active_tokens`,
  getRuntimeInformationForFlowNode: `/process_model/${params.processModelId}/flow_node/${params.flowNodeId}/runtime_information`,
  getActiveTokensForFlowNode: `/token/flow_node/${params.flowNodeId}/active_tokens`,
};

export const restSettings = {
  params: params,
  queryParams: queryParams,
  paths: paths,
};
