import {FlowNodeInstance} from '@process-engine/flow_node_instance.contracts';

import {Metric} from '../data_models/metrics/metric';

/**
 * Defines the contracts for a Repository that can be used to get KPI data
 * from a ProcessEngine.
 */
export interface IKpiRepository {

  /**
   * Retrieves the metrics for a specific ProcessModel.
   *
   * @async
   * @param processModelId The ID of ProcessModel for which to retrieve
   *                       the metrics.
   * @returns              A list of metrics.
   */
  readMetricsForProcessModel(processModelId: string): Promise<Array<Metric>>;

  /**
   * Gets all FlowNodeInstances of a specific ProcessModel.
   *
   * @async
   * @param   processModelId The ID of the ProcessModel for which to get the
   *                         FlowNodeInstances.
   * @returns                The retrieved FlowNodeInstances.
   */
  getFlowNodeInstancesForProcessModel(processModelId: string): Promise<Array<FlowNodeInstance>>;

  /**
   * Gets all active FlowNodeInstances of a specific Correlation and ProcessModel.
   *
   * @async
   * @param   correlationId The ID of the Correlation for which to get
   *                            the active FlowNodeInstances.
   * @param   processModelId The ID of the ProcessModel for which to get
   *                            the active FlowNodeInstances.
   * @returns                   The retrieved FlowNodeInstances.
   */
  getActiveFlowNodeInstancesForProcessModelInCorrelation(correlationId: string, processModelId: string): Promise<Array<FlowNodeInstance>>;

  /**
   * Gets all active FlowNodeInstances of a specific ProcessInstance.
   *
   * @async
   * @param   processInstanceId The ID of the ProcessInstance for which to get
   *                            the active FlowNodeInstances.
   * @returns                   The retrieved FlowNodeInstances.
   */
  getActiveFlowNodeInstancesForProcessInstance(processInstanceId: string): Promise<Array<FlowNodeInstance>>;

  /**
   * Gets all FlowNodeInstances with a specific flowNodeId.
   *
   * @async
   * @param   flowNodeId The ID of the flowNode for which to retrieve
   *                     FlowNodeInstances.
   * @returns            The retrieved FlowNodeInstances.
   */
  getActiveFlowNodeInstancesFlowNode(flowNodeId: string): Promise<Array<FlowNodeInstance>>;
}
