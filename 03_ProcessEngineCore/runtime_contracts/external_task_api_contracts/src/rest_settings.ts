// tslint:disable:typedef
const params = {
  externalTaskId: ':external_task_id',
};

const paths = {
  fetchAndLockExternalTasks: `/fetch_and_lock`,
  extendLock: `/task/${params.externalTaskId}/extend_lock`,
  handleBpmnError: `/task/${params.externalTaskId}/handle_bpmn_error`,
  handleServiceError: `/task/${params.externalTaskId}/handle_service_error`,
  finishExternalTask: `/task/${params.externalTaskId}/finish`,
};

/**
 * Contains the endpoints and various rest parameters used by the external task api.
 */
export const restSettings = {
  /**
   * A collection of all url parameters employed by the external task api.
   */
  params: params,
  /**
   * A collection of all urls employed by the external task api.
   */
  paths: paths,
};
