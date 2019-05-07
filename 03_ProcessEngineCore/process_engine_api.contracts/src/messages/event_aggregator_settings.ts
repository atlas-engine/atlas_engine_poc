/* eslint max-len: "off" */
export const messageParams = {
  correlationId: ':correlation_id',
  flowNodeInstanceId: ':flow_node_instance_id',
  processInstanceId: ':process_instance_id',
};

export const messagePaths = {
  finishUserTask:
    `/processengine/correlation/${messageParams.correlationId}/processinstance/${messageParams.processInstanceId}/usertask/${messageParams.flowNodeInstanceId}/finish`,
  userTaskWithInstanceIdFinished:
    `/processengine/correlation/${messageParams.correlationId}/processinstance/${messageParams.processInstanceId}/usertask/${messageParams.flowNodeInstanceId}/finished`,
};
