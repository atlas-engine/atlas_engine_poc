import {IIdentity} from '@essential-projects/iam_contracts';

import {Correlation} from '@process-engine/correlation.contracts';
import {FlowNodeInstance, ProcessToken} from '@process-engine/flow_node_instance.contracts';
import {Model} from '@process-engine/process_model.contracts';

/**
 * The IUserTaskConsumerApi is used to retreive and manage UserTasks.
 */
export interface IUserTaskRepository {

  /**
   * Gets all suspended FlowNodeInstances of a specific Correlation.
   *
   * @async
   * @param   correlationId The ID of the Correlation for which to get the
   *                        FlowNodeInstances.
   * @returns               The retrieved FlowNodeInstances.
   */
  getSuspendedFlowNodeInstancesInCorrelation(correlationId: string): Promise<Array<FlowNodeInstance>>;

  /**
   * Gets all suspended FlowNodeInstances of a specific ProcessInstance.
   *
   * @async
   * @param processInstanceId The ID of the ProcessInstance for which to get the
   *                          FlowNodeInstances.
   * @returns                 The retrieved FlowNodeInstances.
   */
  getSuspendedFlowNodeInstancesInProcessInstance(processInstanceId: string): Promise<Array<FlowNodeInstance>>;

  /**
   * Gets a FlowNodeInstance by its flowNodeInstanceId.
   *
   * @async
   * @param   flowNodeInstanceId The ID of the FlowNodeInstance to retrieve.
   * @returns                    The retrieved FlowNodeInstance.
   * @throws                     404, if the FlowNodeInstance was not found.
   */
  getFlowNodeInstanceById(flowNodeInstanceId: string): Promise<FlowNodeInstance>;

  /**
   * Gets all ProcessTokens of a specific ProcessInstance.
   *
   * @async
   * @param   processInstanceId The ID of the ProcessInstance for which to get the
   *                            ProcessTokens.
   * @returns                   The retrieved ProcessTokens.
   */
  getProcessTokensForProcessInstance(processInstanceId: string): Promise<Array<ProcessToken>>;

  /**
   * Gets the entry that belongs to the given ProcessInstanceId.
   * Note that ProcessInstanceIds are always unique, so this will always
   * return only one entry.
   *
   * @async
   * @param identity          The executing users identity.
   * @param processInstanceId The ID of the ProcessInstance for which to retrieve
   *                          the Correlations.
   * @returns                 The retrieved Correlation.
   * @throws                  404, If the Correlation was not found.
   */
  getCorrelationByProcessInstanceId(identity: IIdentity, processInstanceId: string): Promise<Correlation>;

  /**
   * Retrieves a ProcessModel by its hash.
   *
   * @async
   * @param  identity        Contains the requesting users identity.
   * @param  processModelId: The ID of the ProcessModel to get.
   * @param  hash            The hash of the ProcessModel to get.
   *                         Used for getting specific versions of the ProcessModel.
   * @returns                The retrieved ProcessModel.
   * @throws                 404, if the ProcessModel was not found.
   */
  getProcessModelByHash(identity: IIdentity, processModelId: string, hash: string): Promise<Model.Process>;
}
