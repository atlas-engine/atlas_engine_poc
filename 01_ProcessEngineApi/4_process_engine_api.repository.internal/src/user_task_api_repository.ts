import {IIdentity} from '@essential-projects/iam_contracts';

import {Correlation, ICorrelationService} from '@process-engine/correlation.contracts';
import {Repositories} from '@process-engine/process_engine_api.contracts';
import {FlowNodeInstance, IFlowNodeInstanceService, ProcessToken} from '@process-engine/flow_node_instance.contracts';
import {IProcessModelUseCases, Model} from '@process-engine/process_model.contracts';

export class UserTaskApiRepository implements Repositories.IUserTaskRepository {

  private readonly correlationService: ICorrelationService;
  private readonly flowNodeInstanceService: IFlowNodeInstanceService;
  private readonly processModelUseCase: IProcessModelUseCases;

  constructor(
    correlationRepository: ICorrelationService,
    flowNodeInstanceService: IFlowNodeInstanceService,
    processModelUse: IProcessModelUseCases,
  ) {
    this.correlationService = correlationRepository;
    this.processModelUseCase = processModelUse;
    this.flowNodeInstanceService = flowNodeInstanceService;
  }

  public async getSuspendedFlowNodeInstancesInCorrelation(correlationId: string): Promise<Array<FlowNodeInstance>> {
    return this.flowNodeInstanceService.querySuspendedByCorrelation(correlationId);
  }

  public async getSuspendedFlowNodeInstancesInProcessInstance(processInstanceId: string): Promise<Array<FlowNodeInstance>> {
    return this.flowNodeInstanceService.querySuspendedByProcessInstance(processInstanceId);
  }

  public async getFlowNodeInstanceById(flowNodeInstanceId: string): Promise<FlowNodeInstance> {
    return this.flowNodeInstanceService.queryByInstanceId(flowNodeInstanceId);
  }

  public async getProcessTokensForProcessInstance(processInstanceId: string): Promise<Array<ProcessToken>> {
    return this.flowNodeInstanceService.queryProcessTokensByProcessInstanceId(processInstanceId);
  }

  public async getCorrelationByProcessInstanceId(identity: IIdentity, processInstanceId: string): Promise<Correlation> {
    return this.correlationService.getByProcessInstanceId(identity, processInstanceId);
  }

  public async getProcessModelByHash(identity: IIdentity, processModelId: string, processModelHash: string): Promise<Model.Process> {
    return this.processModelUseCase.getByHash(identity, processModelId, processModelHash);
  }

}
