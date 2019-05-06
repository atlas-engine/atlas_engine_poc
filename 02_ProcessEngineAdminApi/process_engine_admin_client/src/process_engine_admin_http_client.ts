import * as EssentialProjectErrors from '@essential-projects/errors_ts';
import {IHttpClient, IRequestOptions, IResponse} from '@essential-projects/http_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {DataModels, IProcessEngineAdminApi, restSettings} from '@process-engine/management_api_contracts';

export class ProcessEngineAdminHttpClient implements IProcessEngineAdminApi {
  private baseUrl: string = 'api/process-engine-admin/v1';

  private _httpClient: IHttpClient;

  public config: any;

  constructor(httpClient: IHttpClient) {
    this._httpClient = httpClient;
  }

  // Deployment
  public async importBpmnFromXml(
    identity: IIdentity,
    payload: DataModels.Deployment.ImportProcessDefinitionsRequestPayload,
  ): Promise<void> {
    this._ensureIsAuthorized(identity);

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const url: string = this._applyBaseUrl(restSettings.paths.importProcessModel);

    await this._httpClient.post<DataModels.Deployment.ImportProcessDefinitionsRequestPayload, any>(url, requestAuthHeaders);
  }

  public async undeploy(identity: IIdentity, processModelId: string): Promise<void> {
    this._ensureIsAuthorized(identity);

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.undeployProcessModel
      .replace(restSettings.params.processModelId, processModelId);

    const url: string = this._applyBaseUrl(restPath);

    await this._httpClient.post<DataModels.Deployment.ImportProcessDefinitionsRequestPayload, any>(url, requestAuthHeaders);
  }

  // Heatmap related features
  public async getRuntimeInformationForProcessModel(
    identity: IIdentity,
    processModelId: string,
  ): Promise<Array<DataModels.Kpi.FlowNodeRuntimeInformation>> {
    this._ensureIsAuthorized(identity);

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.getRuntimeInformationForProcessModel
      .replace(restSettings.params.processModelId, processModelId);

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<Array<DataModels.Kpi.FlowNodeRuntimeInformation>> =
      await this._httpClient.get<Array<DataModels.Kpi.FlowNodeRuntimeInformation>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getRuntimeInformationForFlowNode(
    identity: IIdentity,
    processModelId: string,
    flowNodeId: string,
  ): Promise<DataModels.Kpi.FlowNodeRuntimeInformation> {
    this._ensureIsAuthorized(identity);

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.getRuntimeInformationForFlowNode
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.flowNodeId, flowNodeId);

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<DataModels.Kpi.FlowNodeRuntimeInformation> =
      await this._httpClient.get<DataModels.Kpi.FlowNodeRuntimeInformation>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getActiveTokensForProcessModel(identity: IIdentity, processModelId: string): Promise<Array<DataModels.Kpi.ActiveToken>> {
    this._ensureIsAuthorized(identity);

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.getActiveTokensForProcessModel
      .replace(restSettings.params.processModelId, processModelId);

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<Array<DataModels.Kpi.ActiveToken>> =
      await this._httpClient.get<Array<DataModels.Kpi.ActiveToken>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getActiveTokensForProcessInstance(identity: IIdentity, processInstanceId: string): Promise<Array<DataModels.Kpi.ActiveToken>> {
    this._ensureIsAuthorized(identity);

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.getActiveTokensForProcessInstance
      .replace(restSettings.params.processInstanceId, processInstanceId);

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<Array<DataModels.Kpi.ActiveToken>> =
      await this._httpClient.get<Array<DataModels.Kpi.ActiveToken>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getActiveTokensForCorrelationAndProcessModel(
    identity: IIdentity,
    correlationId: string,
    processModelId: string,
  ): Promise<Array<DataModels.Kpi.ActiveToken>> {
    this._ensureIsAuthorized(identity);

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.getActiveTokensForCorrelationAndProcessModel
      .replace(restSettings.params.correlationId, correlationId)
      .replace(restSettings.params.processModelId, processModelId);

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<Array<DataModels.Kpi.ActiveToken>> =
      await this._httpClient.get<Array<DataModels.Kpi.ActiveToken>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getActiveTokensForFlowNode(identity: IIdentity, flowNodeId: string): Promise<Array<DataModels.Kpi.ActiveToken>> {
    this._ensureIsAuthorized(identity);

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.getActiveTokensForFlowNode
      .replace(restSettings.params.flowNodeId, flowNodeId);

    const url: string = this._applyBaseUrl(restPath);

    const httpResponse: IResponse<Array<DataModels.Kpi.ActiveToken>> =
      await this._httpClient.get<Array<DataModels.Kpi.ActiveToken>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  private _createRequestAuthHeaders(identity: IIdentity): IRequestOptions {

    const authTokenNotProvided: boolean = !identity || typeof identity.token !== 'string';
    if (authTokenNotProvided) {
      return {};
    }

    const requestAuthHeaders: IRequestOptions = {
      headers: {
        Authorization: `Bearer ${identity.token}`,
      },
    };

    return requestAuthHeaders;
  }

  private _applyBaseUrl(url: string): string {
    return `${this.baseUrl}${url}`;
  }

  private _ensureIsAuthorized(identity: IIdentity): void {
    const noAuthTokenProvided: boolean = !identity || typeof identity.token !== 'string';
    if (noAuthTokenProvided) {
      throw new EssentialProjectErrors.UnauthorizedError('No auth token provided!');
    }
  }
}
