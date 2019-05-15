import {
  FlowNode,
  FlowNodeInstance,
  FlowNodeInstanceState,
  IFlowNodeInstanceRepository,
  IFlowNodeInstanceService,
  ProcessToken,
} from '@process-engine/flow_node_instance.contracts';

import {IIAMService} from '@essential-projects/iam_contracts';

export class FlowNodeInstanceService implements IFlowNodeInstanceService {

  private readonly _flowNodeInstanceRepository: IFlowNodeInstanceRepository;
  private readonly _iamService: IIAMService;

  constructor(flowNodeInstanceRepository: IFlowNodeInstanceRepository, iamService: IIAMService) {
    this._flowNodeInstanceRepository = flowNodeInstanceRepository;
    this._iamService = iamService;
  }

  public async querySpecificFlowNode(correlationId: string, processModelId: string, flowNodeId: string): Promise<FlowNodeInstance> {
    return this._flowNodeInstanceRepository.querySpecificFlowNode(correlationId, processModelId, flowNodeId);
  }

  public async queryByFlowNodeId(flowNodeId: string): Promise<Array<FlowNodeInstance>> {
    return this._flowNodeInstanceRepository.queryByFlowNodeId(flowNodeId);
  }

  public async queryByInstanceId(instanceId: string): Promise<FlowNodeInstance> {
    return this._flowNodeInstanceRepository.queryByInstanceId(instanceId);
  }

  public async queryByCorrelation(correlationId: string): Promise<Array<FlowNodeInstance>> {
    return this._flowNodeInstanceRepository.queryByCorrelation(correlationId);
  }

  public async queryByProcessModel(processModelId: string): Promise<Array<FlowNodeInstance>> {
    return this._flowNodeInstanceRepository.queryByProcessModel(processModelId);
  }

  public async queryByCorrelationAndProcessModel(correlationId: string, processModelId: string): Promise<Array<FlowNodeInstance>> {
    return this._flowNodeInstanceRepository.queryByCorrelationAndProcessModel(correlationId, processModelId);
  }

  public async queryByProcessInstance(processInstanceId: string): Promise<Array<FlowNodeInstance>> {
    return this._flowNodeInstanceRepository.queryByProcessInstance(processInstanceId);
  }

  public async queryByState(state: FlowNodeInstanceState): Promise<Array<FlowNodeInstance>> {
    return this._flowNodeInstanceRepository.queryByState(state);
  }

  public async queryActive(): Promise<Array<FlowNodeInstance>> {
    return this._flowNodeInstanceRepository.queryActive();
  }

  public async queryActiveByProcessInstance(processInstanceId: string): Promise<Array<FlowNodeInstance>> {
    return this._flowNodeInstanceRepository.queryActiveByProcessInstance(processInstanceId);
  }

  public async queryActiveByCorrelationAndProcessModel(correlationId: string,
                                                       processModelId: string,
                                                      ): Promise<Array<FlowNodeInstance>> {
    return this._flowNodeInstanceRepository.queryActiveByCorrelationAndProcessModel(correlationId, processModelId);
  }

  public async querySuspendedByCorrelation(correlationId: string): Promise<Array<FlowNodeInstance>> {
    return this._flowNodeInstanceRepository.querySuspendedByCorrelation(correlationId);
  }

  public async querySuspendedByProcessModel(processModelId: string): Promise<Array<FlowNodeInstance>> {
    return this._flowNodeInstanceRepository.querySuspendedByProcessModel(processModelId);
  }

  public async querySuspendedByProcessInstance(processInstanceId: string): Promise<Array<FlowNodeInstance>> {
    return this._flowNodeInstanceRepository.querySuspendedByProcessInstance(processInstanceId);
  }

  public async queryProcessTokensByProcessInstanceId(processInstanceId: string): Promise<Array<ProcessToken>> {
    return this._flowNodeInstanceRepository.queryProcessTokensByProcessInstanceId(processInstanceId);
  }

  public async persistOnEnter(flowNode: FlowNode,
                              flowNodeInstanceId: string,
                              token: ProcessToken,
                              previousFlowNodeInstanceId: string,
                             ): Promise<FlowNodeInstance> {

    return this._flowNodeInstanceRepository.persistOnEnter(flowNode, flowNodeInstanceId, token, previousFlowNodeInstanceId);
  }

  public async persistOnExit(flowNode: FlowNode,
                             flowNodeInstanceId: string,
                             token: ProcessToken,
                            ): Promise<FlowNodeInstance> {

    return this._flowNodeInstanceRepository.persistOnExit(flowNode, flowNodeInstanceId, token);
  }

  public async persistOnError(flowNode: FlowNode,
                              flowNodeInstanceId: string,
                              token: ProcessToken,
                              error: Error,
                             ): Promise<FlowNodeInstance> {

    return this._flowNodeInstanceRepository.persistOnError(flowNode, flowNodeInstanceId, token, error);
  }

  public async persistOnTerminate(flowNode: FlowNode,
                                  flowNodeInstanceId: string,
                                  token: ProcessToken,
                                 ): Promise<FlowNodeInstance> {

    return this._flowNodeInstanceRepository.persistOnTerminate(flowNode, flowNodeInstanceId, token);
  }

  public async suspend(flowNodeId: string, flowNodeInstanceId: string, token: ProcessToken): Promise<FlowNodeInstance> {
    return this._flowNodeInstanceRepository.suspend(flowNodeId, flowNodeInstanceId, token);
  }

  public async resume(flowNodeId: string, flowNodeInstanceId: string, token: ProcessToken): Promise<FlowNodeInstance> {
    return this._flowNodeInstanceRepository.resume(flowNodeId, flowNodeInstanceId, token);
  }

  public async deleteByProcessModelId(processModelId: string): Promise<void> {
    return this._flowNodeInstanceRepository.deleteByProcessModelId(processModelId);
  }

}
