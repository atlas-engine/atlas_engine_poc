import {IIdentity} from '@essential-projects/iam_contracts';

import {APIs, DataModels, IProcessEngineAdminApi} from '@process-engine/process_engine_admin_api.contracts';

export class ProcessEngineAdminInternalClient implements IProcessEngineAdminApi {

  private deploymentApiService: APIs.IDeploymentApi = undefined;
  private kpiApiService: APIs.IKpiApi = undefined;

  constructor(deploymentApiService: APIs.IDeploymentApi, kpiApiService: APIs.IKpiApi) {
    this.deploymentApiService = deploymentApiService;
    this.kpiApiService = kpiApiService;
  }

  // Deployment
  public async importBpmnFromXml(identity: IIdentity, payload: DataModels.Deployment.ImportProcessDefinitionsRequestPayload): Promise<void> {
    return this.deploymentApiService.importBpmnFromXml(identity, payload);
  }

  public async importBpmnFromFile(identity: IIdentity, filePath: string, name?: string, overwriteExisting?: boolean): Promise<void> {
    return this.deploymentApiService.importBpmnFromFile(identity, filePath, name, overwriteExisting);
  }

  public async undeploy(identity: IIdentity, processModelId: string): Promise<void> {
    return this.deploymentApiService.undeploy(identity, processModelId);
  }

  // KPI
  public async getRuntimeInformationForProcessModel(
    identity: IIdentity,
    processModelId: string,
  ): Promise<Array<DataModels.Kpi.FlowNodeRuntimeInformation>> {

    return this.kpiApiService.getRuntimeInformationForProcessModel(identity, processModelId);
  }

  public async getRuntimeInformationForFlowNode(
    identity: IIdentity,
    processModelId: string,
    flowNodeId: string,
  ): Promise<DataModels.Kpi.FlowNodeRuntimeInformation> {

    return this.kpiApiService.getRuntimeInformationForFlowNode(identity, processModelId, flowNodeId);
  }

  public async getActiveTokensForProcessModel<TPayload>(
    identity: IIdentity,
    processModelId: string,
  ): Promise<Array<DataModels.Kpi.ActiveToken<TPayload>>> {
    return this.kpiApiService.getActiveTokensForProcessModel(identity, processModelId);
  }

  public async getActiveTokensForCorrelationAndProcessModel<TPayload>(
    identity: IIdentity,
    correlationId: string,
    processModelId: string,
  ): Promise<Array<DataModels.Kpi.ActiveToken<TPayload>>> {
    return this.kpiApiService.getActiveTokensForCorrelationAndProcessModel(identity, correlationId, processModelId);
  }

  public async getActiveTokensForProcessInstance<TPayload>(
    identity: IIdentity,
    processInstanceId: string,
  ): Promise<Array<DataModels.Kpi.ActiveToken<TPayload>>> {
    return this.kpiApiService.getActiveTokensForProcessInstance(identity, processInstanceId);
  }

  public async getActiveTokensForFlowNode<TPayload>(
    identity: IIdentity,
    flowNodeId: string,
  ): Promise<Array<DataModels.Kpi.ActiveToken<TPayload>>> {
    return this.kpiApiService.getActiveTokensForFlowNode(identity, flowNodeId);
  }

}
