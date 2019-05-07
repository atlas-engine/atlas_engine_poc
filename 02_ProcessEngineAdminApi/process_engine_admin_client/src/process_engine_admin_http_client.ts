import * as EssentialProjectErrors from '@essential-projects/errors_ts';
import {IHttpClient, IRequestOptions, IResponse} from '@essential-projects/http_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {
  DataModels,
  IProcessEngineAdminApi,
  restSettings,
} from '@process-engine/process_engine_admin_api.contracts';

export class ProcessEngineAdminHttpClient implements IProcessEngineAdminApi {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public config: any;

  private baseUrl: string = 'api/process-engine-admin/v1';

  private httpClient: IHttpClient;

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient;
  }

  // Deployment
  public async importBpmnFromXml(
    identity: IIdentity,
    payload: DataModels.Deployment.ImportProcessDefinitionsRequestPayload,
  ): Promise<void> {
    this.ensureIsAuthorized(identity);

    const requestAuthHeaders: IRequestOptions = this.createRequestAuthHeaders(identity);

    const url: string = this.applyBaseUrl(restSettings.paths.importProcessModel);

    await this.httpClient.post<DataModels.Deployment.ImportProcessDefinitionsRequestPayload, void>(url, payload, requestAuthHeaders);
  }

  public async importBpmnFromFile(identity: IIdentity, filePath: string, name?: string, overwriteExisting?: boolean): Promise<void> {
    throw new Error('Method not implemented.'); // Not sure if this should even be possible via http?
  }

  public async undeploy(identity: IIdentity, processModelId: string): Promise<void> {
    this.ensureIsAuthorized(identity);

    const requestAuthHeaders: IRequestOptions = this.createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.undeployProcessModel
      .replace(restSettings.params.processModelId, processModelId);

    const url: string = this.applyBaseUrl(restPath);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await this.httpClient.post<any, any>(url, {}, requestAuthHeaders);
  }

  // Heatmap related features
  public async getRuntimeInformationForProcessModel(
    identity: IIdentity,
    processModelId: string,
  ): Promise<Array<DataModels.Kpi.FlowNodeRuntimeInformation>> {
    this.ensureIsAuthorized(identity);

    const requestAuthHeaders: IRequestOptions = this.createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.getRuntimeInformationForProcessModel
      .replace(restSettings.params.processModelId, processModelId);

    const url: string = this.applyBaseUrl(restPath);

    const httpResponse: IResponse<Array<DataModels.Kpi.FlowNodeRuntimeInformation>> =
      await this.httpClient.get<Array<DataModels.Kpi.FlowNodeRuntimeInformation>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getRuntimeInformationForFlowNode(
    identity: IIdentity,
    processModelId: string,
    flowNodeId: string,
  ): Promise<DataModels.Kpi.FlowNodeRuntimeInformation> {
    this.ensureIsAuthorized(identity);

    const requestAuthHeaders: IRequestOptions = this.createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.getRuntimeInformationForFlowNode
      .replace(restSettings.params.processModelId, processModelId)
      .replace(restSettings.params.flowNodeId, flowNodeId);

    const url: string = this.applyBaseUrl(restPath);

    const httpResponse: IResponse<DataModels.Kpi.FlowNodeRuntimeInformation> =
      await this.httpClient.get<DataModels.Kpi.FlowNodeRuntimeInformation>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getActiveTokensForProcessModel<TPayload>(
    identity: IIdentity,
    processModelId: string,
  ): Promise<Array<DataModels.Kpi.ActiveToken<TPayload>>> {
    this.ensureIsAuthorized(identity);

    const requestAuthHeaders: IRequestOptions = this.createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.getActiveTokensForProcessModel
      .replace(restSettings.params.processModelId, processModelId);

    const url: string = this.applyBaseUrl(restPath);

    const httpResponse: IResponse<Array<DataModels.Kpi.ActiveToken<TPayload>>> =
      await this.httpClient.get<Array<DataModels.Kpi.ActiveToken<TPayload>>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getActiveTokensForProcessInstance<TPayload>(
    identity: IIdentity,
    processInstanceId: string,
  ): Promise<Array<DataModels.Kpi.ActiveToken<TPayload>>> {
    this.ensureIsAuthorized(identity);

    const requestAuthHeaders: IRequestOptions = this.createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.getActiveTokensForProcessInstance
      .replace(restSettings.params.processInstanceId, processInstanceId);

    const url: string = this.applyBaseUrl(restPath);

    const httpResponse: IResponse<Array<DataModels.Kpi.ActiveToken<TPayload>>> =
      await this.httpClient.get<Array<DataModels.Kpi.ActiveToken<TPayload>>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getActiveTokensForCorrelationAndProcessModel<TPayload>(
    identity: IIdentity,
    correlationId: string,
    processModelId: string,
  ): Promise<Array<DataModels.Kpi.ActiveToken<TPayload>>> {
    this.ensureIsAuthorized(identity);

    const requestAuthHeaders: IRequestOptions = this.createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.getActiveTokensForCorrelationAndProcessModel
      .replace(restSettings.params.correlationId, correlationId)
      .replace(restSettings.params.processModelId, processModelId);

    const url: string = this.applyBaseUrl(restPath);

    const httpResponse: IResponse<Array<DataModels.Kpi.ActiveToken<TPayload>>> =
      await this.httpClient.get<Array<DataModels.Kpi.ActiveToken<TPayload>>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getActiveTokensForFlowNode<TPayload>(
    identity: IIdentity,
    flowNodeId: string,
  ): Promise<Array<DataModels.Kpi.ActiveToken<TPayload>>> {
    this.ensureIsAuthorized(identity);

    const requestAuthHeaders: IRequestOptions = this.createRequestAuthHeaders(identity);

    const restPath: string = restSettings.paths.getActiveTokensForFlowNode
      .replace(restSettings.params.flowNodeId, flowNodeId);

    const url: string = this.applyBaseUrl(restPath);

    const httpResponse: IResponse<Array<DataModels.Kpi.ActiveToken<TPayload>>> =
      await this.httpClient.get<Array<DataModels.Kpi.ActiveToken<TPayload>>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  private createRequestAuthHeaders(identity: IIdentity): IRequestOptions {

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

  private applyBaseUrl(url: string): string {
    return `${this.baseUrl}${url}`;
  }

  private ensureIsAuthorized(identity: IIdentity): void {
    const noAuthTokenProvided: boolean = !identity || typeof identity.token !== 'string';
    if (noAuthTokenProvided) {
      throw new EssentialProjectErrors.UnauthorizedError('No auth token provided!');
    }
  }

}
