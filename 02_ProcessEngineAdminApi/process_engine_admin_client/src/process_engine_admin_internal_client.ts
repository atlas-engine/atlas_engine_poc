import {Subscription} from '@essential-projects/event_aggregator_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {DataModels, IProcessEngineAdminApi} from '@process-engine/management_api_contracts';

export class ProcessEngineAdminInternalClient implements IProcessEngineAdminApi {

  private _managementApiService: IProcessEngineAdminApi = undefined;

  constructor(managementApiService: IProcessEngineAdminApi) {
    this._managementApiService = managementApiService;
  }

  // Heatmap related features
  public async getRuntimeInformationForProcessModel(
    identity: IIdentity,
    processModelId: string,
  ): Promise<Array<DataModels.Kpi.FlowNodeRuntimeInformation>> {

    return this._managementApiService.getRuntimeInformationForProcessModel(identity, processModelId);
  }

  public async getRuntimeInformationForFlowNode(
    identity: IIdentity,
    processModelId: string,
    flowNodeId: string,
  ): Promise<DataModels.Kpi.FlowNodeRuntimeInformation> {

    return this._managementApiService.getRuntimeInformationForFlowNode(identity, processModelId, flowNodeId);
  }

  public async getActiveTokensForProcessModel(identity: IIdentity, processModelId: string): Promise<Array<DataModels.Kpi.ActiveToken>> {
    return this._managementApiService.getActiveTokensForProcessModel(identity, processModelId);
  }

  public async getActiveTokensForCorrelationAndProcessModel(
    identity: IIdentity,
    correlationId: string,
    processModelId: string,
  ): Promise<Array<DataModels.Kpi.ActiveToken>> {
    return this._managementApiService.getActiveTokensForCorrelationAndProcessModel(identity, correlationId, processModelId);
  }

  public async getActiveTokensForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
  ): Promise<Array<DataModels.Kpi.ActiveToken>> {
    return this._managementApiService.getActiveTokensForProcessInstance(identity, processInstanceId);
  }

  public async getActiveTokensForFlowNode(identity: IIdentity, flowNodeId: string): Promise<Array<DataModels.Kpi.ActiveToken>> {
    return this._managementApiService.getActiveTokensForFlowNode(identity, flowNodeId);
  }
}
