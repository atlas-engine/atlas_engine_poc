const params = {
  externalTaskId: ':external_task_id',
};

const paths = {
  fetchAndLockExternalTasks: '/fetch_and_lock',
  extendLock: `/task/${params.externalTaskId}/extend_lock`,
  handleBpmnError: `/task/${params.externalTaskId}/handle_bpmn_error`,
  handleServiceError: `/task/${params.externalTaskId}/handle_service_error`,
  finishExternalTask: `/task/${params.externalTaskId}/finish`,
};

export const restSettings = {
  params: params,
  paths: paths,
};
