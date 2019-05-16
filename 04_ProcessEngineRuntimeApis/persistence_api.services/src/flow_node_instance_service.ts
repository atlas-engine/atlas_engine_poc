import {IIAMService} from '@essential-projects/iam_contracts';

import {Repositories, Services, Types} from '@process-engine/persistence_api.contracts';

export class FlowNodeInstanceService implements Services.IFlowNodeInstanceService {

  private readonly flowNodeInstanceRepository: Repositories.IFlowNodeInstanceRepository;
  private readonly iamService: IIAMService;

  constructor(flowNodeInstanceRepository: Repositories.IFlowNodeInstanceRepository, iamService: IIAMService) {
    this.flowNodeInstanceRepository = flowNodeInstanceRepository;
    this.iamService = iamService;
  }

  public async querySpecificFlowNode(
    correlationId: string,
    processModelId: string,
    flowNodeId: string,
  ): Promise<Types.FlowNodeInstance.FlowNodeInstance> {
    return this.flowNodeInstanceRepository.querySpecificFlowNode(correlationId, processModelId, flowNodeId);
  }

  public async queryByFlowNodeId(flowNodeId: string): Promise<Array<Types.FlowNodeInstance.FlowNodeInstance>> {
    return this.flowNodeInstanceRepository.queryByFlowNodeId(flowNodeId);
  }

  public async queryByInstanceId(instanceId: string): Promise<Types.FlowNodeInstance.FlowNodeInstance> {
    return this.flowNodeInstanceRepository.queryByInstanceId(instanceId);
  }

  public async queryByCorrelation(correlationId: string): Promise<Array<Types.FlowNodeInstance.FlowNodeInstance>> {
    return this.flowNodeInstanceRepository.queryByCorrelation(correlationId);
  }

  public async queryByProcessModel(processModelId: string): Promise<Array<Types.FlowNodeInstance.FlowNodeInstance>> {
    return this.flowNodeInstanceRepository.queryByProcessModel(processModelId);
  }

  public async queryByCorrelationAndProcessModel(
    correlationId: string,
    processModelId: string,
  ): Promise<Array<Types.FlowNodeInstance.FlowNodeInstance>> {
    return this.flowNodeInstanceRepository.queryByCorrelationAndProcessModel(correlationId, processModelId);
  }

  public async queryByProcessInstance(processInstanceId: string): Promise<Array<Types.FlowNodeInstance.FlowNodeInstance>> {
    return this.flowNodeInstanceRepository.queryByProcessInstance(processInstanceId);
  }

  public async queryByState(state: Types.FlowNodeInstance.FlowNodeInstanceState): Promise<Array<Types.FlowNodeInstance.FlowNodeInstance>> {
    return this.flowNodeInstanceRepository.queryByState(state);
  }

  public async queryActive(): Promise<Array<Types.FlowNodeInstance.FlowNodeInstance>> {
    return this.flowNodeInstanceRepository.queryActive();
  }

  public async queryActiveByProcessInstance(processInstanceId: string): Promise<Array<Types.FlowNodeInstance.FlowNodeInstance>> {
    return this.flowNodeInstanceRepository.queryActiveByProcessInstance(processInstanceId);
  }

  public async queryActiveByCorrelationAndProcessModel(
    correlationId: string,
    processModelId: string,
  ): Promise<Array<Types.FlowNodeInstance.FlowNodeInstance>> {
    return this.flowNodeInstanceRepository.queryActiveByCorrelationAndProcessModel(correlationId, processModelId);
  }

  public async querySuspendedByCorrelation(correlationId: string): Promise<Array<Types.FlowNodeInstance.FlowNodeInstance>> {
    return this.flowNodeInstanceRepository.querySuspendedByCorrelation(correlationId);
  }

  public async querySuspendedByProcessModel(processModelId: string): Promise<Array<Types.FlowNodeInstance.FlowNodeInstance>> {
    return this.flowNodeInstanceRepository.querySuspendedByProcessModel(processModelId);
  }

  public async querySuspendedByProcessInstance(processInstanceId: string): Promise<Array<Types.FlowNodeInstance.FlowNodeInstance>> {
    return this.flowNodeInstanceRepository.querySuspendedByProcessInstance(processInstanceId);
  }

  public async queryProcessTokensByProcessInstanceId(processInstanceId: string): Promise<Array<Types.FlowNodeInstance.ProcessToken>> {
    return this.flowNodeInstanceRepository.queryProcessTokensByProcessInstanceId(processInstanceId);
  }

  public async persistOnEnter(
    flowNode: Types.ProcessModel.Base.FlowNode,
    flowNodeInstanceId: string,
    token: Types.FlowNodeInstance.ProcessToken,
    previousFlowNodeInstanceId: string,
  ): Promise<Types.FlowNodeInstance.FlowNodeInstance> {

    return this.flowNodeInstanceRepository.persistOnEnter(flowNode, flowNodeInstanceId, token, previousFlowNodeInstanceId);
  }

  public async persistOnExit(
    flowNode: Types.ProcessModel.Base.FlowNode,
    flowNodeInstanceId: string,
    token: Types.FlowNodeInstance.ProcessToken,
  ): Promise<Types.FlowNodeInstance.FlowNodeInstance> {

    return this.flowNodeInstanceRepository.persistOnExit(flowNode, flowNodeInstanceId, token);
  }

  public async persistOnError(
    flowNode: Types.ProcessModel.Base.FlowNode,
    flowNodeInstanceId: string,
    token: Types.FlowNodeInstance.ProcessToken,
    error: Error,
  ): Promise<Types.FlowNodeInstance.FlowNodeInstance> {

    return this.flowNodeInstanceRepository.persistOnError(flowNode, flowNodeInstanceId, token, error);
  }

  public async persistOnTerminate(
    flowNode: Types.ProcessModel.Base.FlowNode,
    flowNodeInstanceId: string,
    token: Types.FlowNodeInstance.ProcessToken,
  ): Promise<Types.FlowNodeInstance.FlowNodeInstance> {

    return this.flowNodeInstanceRepository.persistOnTerminate(flowNode, flowNodeInstanceId, token);
  }

  public async suspend(
    flowNodeId: string,
    flowNodeInstanceId: string,
    token: Types.FlowNodeInstance.ProcessToken,
  ): Promise<Types.FlowNodeInstance.FlowNodeInstance> {
    return this.flowNodeInstanceRepository.suspend(flowNodeId, flowNodeInstanceId, token);
  }

  public async resume(
    flowNodeId: string,
    flowNodeInstanceId: string,
    token: Types.FlowNodeInstance.ProcessToken,
  ): Promise<Types.FlowNodeInstance.FlowNodeInstance> {
    return this.flowNodeInstanceRepository.resume(flowNodeId, flowNodeInstanceId, token);
  }

  public async deleteByProcessModelId(processModelId: string): Promise<void> {
    return this.flowNodeInstanceRepository.deleteByProcessModelId(processModelId);
  }

}
