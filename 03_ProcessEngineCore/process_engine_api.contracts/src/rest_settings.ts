const params = {
  processInstanceId: ':process_instance_id',
  processModelId: ':process_model_id',
  correlationId: ':correlation_id',
  startEventId: ':start_event_id',
  endEventId: ':end_event_id',
  userTaskInstanceId: ':user_task_instance_id',
};

const paths = {
  // ProcessModels
  processModels: '/process_models',
  processModelById: `/process_models/${params.processModelId}`,
  startProcessInstance: `/process_models/${params.processModelId}/start`,
  // UserTasks
  correlationUserTasks: `/correlations/${params.correlationId}/user_tasks`,
  finishUserTask: `/processes/${params.processInstanceId}/correlations/${params.correlationId}/usertasks/${params.userTaskInstanceId}/finish`,
};

/**
 * Contains the endpoints and various rest parameters used by the consumer api.
 */
export const restSettings = {
  /**
   * A collection of all url parameters employed by the consumer api.
   */
  params: params,
  /**
   * A collection of all urls employed by the consumer api.
   */
  paths: paths,
};
