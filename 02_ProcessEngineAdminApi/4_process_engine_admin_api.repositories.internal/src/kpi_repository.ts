import {FlowNodeInstance, IFlowNodeInstanceService} from '@process-engine/flow_node_instance.contracts';
import {IMetricsRepository} from '@process-engine/metrics_api_contracts';
import {DataModels, Repositories} from '@process-engine/process_engine_admin_api.contracts';

export class KpiRepository implements Repositories.IKpiRepository {

  private flowNodeInstanceService: IFlowNodeInstanceService;
  private metricsRepository: IMetricsRepository;

  constructor(
    flowNodeInstanceRepository: IFlowNodeInstanceService,
    metricsRepository: IMetricsRepository,
  ) {
    this.flowNodeInstanceService = flowNodeInstanceRepository;
    this.metricsRepository = metricsRepository;
  }

  public async readMetricsForProcessModel(processModelId: string): Promise<Array<DataModels.Metrics.Metric>> {
    return this.metricsRepository.readMetricsForProcessModel(processModelId);
  }

  public async getFlowNodeInstancesForProcessModel(processModelId: string): Promise<Array<FlowNodeInstance>> {
    return this.flowNodeInstanceService.queryByProcessModel(processModelId);
  }

  public async getActiveFlowNodeInstancesForProcessModelInCorrelation(
    correlationId: string,
    processModelId: string,
  ): Promise<Array<FlowNodeInstance>> {
    return this.flowNodeInstanceService.queryActiveByCorrelationAndProcessModel(correlationId, processModelId);
  }

  public async getActiveFlowNodeInstancesForProcessInstance(processInstanceId: string): Promise<Array<FlowNodeInstance>> {
    return this.flowNodeInstanceService.queryActiveByProcessInstance(processInstanceId);
  }

  public async getActiveFlowNodeInstancesFlowNode(flowNodeId: string): Promise<Array<FlowNodeInstance>> {
    return this.flowNodeInstanceService.queryByFlowNodeId(flowNodeId);
  }

}
