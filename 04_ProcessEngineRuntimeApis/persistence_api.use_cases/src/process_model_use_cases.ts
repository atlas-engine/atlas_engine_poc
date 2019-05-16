import {IIAMService, IIdentity} from '@essential-projects/iam_contracts';

import {
  Repositories,
  Services,
  Types,
  UseCases,
} from '@process-engine/persistence_api.contracts';

export class ProcessModelUseCases implements UseCases.IProcessModelUseCases {

  private readonly correlationService: Services.ICorrelationService;
  private readonly externalTaskRepository: Repositories.IExternalTaskRepository;
  private readonly flowNodeInstanceService: Services.IFlowNodeInstanceService;
  private readonly iamService: IIAMService;
  private readonly processDefinitionService: Services.IProcessDefinitionService;

  private canDeleteProcessModel: string = 'can_delete_process_model';

  constructor(
    correlationService: Services.ICorrelationService,
    // TODO: Must be replaced with the service, as soon as it supports the methods we need here.
    externalTaskRepository: Repositories.IExternalTaskRepository,
    flowNodeInstanceService: Services.IFlowNodeInstanceService,
    iamService: IIAMService,
    processDefinitionService: Services.IProcessDefinitionService,
  ) {

    this.correlationService = correlationService;
    this.externalTaskRepository = externalTaskRepository;
    this.flowNodeInstanceService = flowNodeInstanceService;
    this.iamService = iamService;
    this.processDefinitionService = processDefinitionService;
  }

  public async getProcessModelByProcessInstanceId(identity: IIdentity, processInstanceId: string): Promise<Types.ProcessModel.Process> {

    const correlation = await this.correlationService.getByProcessInstanceId(identity, processInstanceId);

    const correlationProcessModel = correlation.processInstances.pop();

    const processModel =
      await this.processDefinitionService.getByHash(identity, correlationProcessModel.processModelId, correlationProcessModel.hash);

    return processModel;
  }

  public async deleteProcessModel(identity: IIdentity, processModelId: string): Promise<void> {
    await this.iamService.ensureHasClaim(identity, this.canDeleteProcessModel);

    await this.processDefinitionService.deleteProcessDefinitionById(processModelId);
    await this.correlationService.deleteCorrelationByProcessModelId(identity, processModelId);
    await this.flowNodeInstanceService.deleteByProcessModelId(processModelId);
    // TODO: There should be a service method for this.
    await this.externalTaskRepository.deleteExternalTasksByProcessModelId(processModelId);
  }

  public async persistProcessDefinitions(identity: IIdentity, name: string, xml: string, overwriteExisting?: boolean): Promise<void> {
    return this.processDefinitionService.persistProcessDefinitions(identity, name, xml, overwriteExisting);
  }

  public async getProcessModelById(identity: IIdentity, processModelId: string): Promise<Types.ProcessModel.Process> {
    return this.processDefinitionService.getProcessModelById(identity, processModelId);
  }

  public async getProcessDefinitionAsXmlByName(identity: IIdentity, name: string): Promise<Types.ProcessDefinitionFromRepository> {
    return this.processDefinitionService.getProcessDefinitionAsXmlByName(identity, name);
  }

  public async getByHash(identity: IIdentity, processModelId: string, hash: string): Promise<Types.ProcessModel.Process> {
    return this.processDefinitionService.getByHash(identity, processModelId, hash);
  }

  public async getProcessModels(identity: IIdentity): Promise<Array<Types.ProcessModel.Process>> {
    return this.processDefinitionService.getProcessModels(identity);
  }

}
