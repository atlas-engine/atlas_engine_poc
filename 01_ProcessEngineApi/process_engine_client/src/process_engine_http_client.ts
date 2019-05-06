import * as EssentialProjectErrors from '@essential-projects/errors_ts';
import {IHttpClient, IRequestOptions, IResponse} from '@essential-projects/http_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {
  DataModels,
  IConsumerApiAccessor,
  IConsumerSocketIoAccessor,
  restSettings,
} from '@process-engine/consumer_api_contracts';

export class ProcessEngineHttpClient implements IConsumerApiAccessor, IConsumerSocketIoAccessor {
  private baseUrl: string = 'api/process-engine/v1';

  private _httpClient: IHttpClient = undefined;

  public config: any;

  constructor(httpClient: IHttpClient) {
    this._httpClient = httpClient;
  }

  // Process models and instances
  public async getProcessModels(identity: IIdentity): Promise<DataModels.ProcessModels.ProcessModelList> {
    this._ensureIsAuthorized(identity);

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const url: string = this._applyBaseUrl(restSettings.paths.processModels);

    const httpResponse: IResponse<DataModels.ProcessModels.ProcessModelList> =
      await this._httpClient.get<DataModels.ProcessModels.ProcessModelList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getProcessModelById(identity: IIdentity, processModelId: string): Promise<DataModels.ProcessModels.ProcessModel> {
    this._ensureIsAuthorized(identity);

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    let url: string = restSettings.paths.processModelById.replace(restSettings.params.processModelId, processModelId);
    url = this._applyBaseUrl(url);

    const httpResponse: IResponse<DataModels.ProcessModels.ProcessModel> =
      await this._httpClient.get<DataModels.ProcessModels.ProcessModel>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async startProcessInstance(
    identity: IIdentity,
    processModelId: string,
    payload: DataModels.ProcessModels.ProcessStartRequestPayload,
    startCallbackType: DataModels.ProcessModels.StartCallbackType,
    startEventId?: string,
    endEventId?: string,
  ): Promise<DataModels.ProcessModels.ProcessStartResponsePayload> {
    this._ensureIsAuthorized(identity);

    const url: string = this._buildStartProcessInstanceUrl(processModelId, startCallbackType, endEventId, startEventId);

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    const httpResponse: IResponse<DataModels.ProcessModels.ProcessStartResponsePayload> =
      await this
        ._httpClient
        // tslint:disable-next-line:max-line-length
        .post<DataModels.ProcessModels.ProcessStartRequestPayload, DataModels.ProcessModels.ProcessStartResponsePayload>(url, payload, requestAuthHeaders);

    return httpResponse.result;
  }

  // UserTasks
  public async getUserTasksForCorrelation(identity: IIdentity, correlationId: string): Promise<DataModels.UserTasks.UserTaskList> {
    this._ensureIsAuthorized(identity);

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    let url: string = restSettings.paths.correlationUserTasks.replace(restSettings.params.correlationId, correlationId);
    url = this._applyBaseUrl(url);

    const httpResponse: IResponse<DataModels.UserTasks.UserTaskList> =
      await this._httpClient.get<DataModels.UserTasks.UserTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async finishUserTask(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    userTaskInstanceId: string,
    userTaskResult: DataModels.UserTasks.UserTaskResult,
  ): Promise<void> {
    this._ensureIsAuthorized(identity);

    const requestAuthHeaders: IRequestOptions = this._createRequestAuthHeaders(identity);

    let url: string = restSettings.paths.finishUserTask
      .replace(restSettings.params.processInstanceId, processInstanceId)
      .replace(restSettings.params.correlationId, correlationId)
      .replace(restSettings.params.userTaskInstanceId, userTaskInstanceId);

    url = this._applyBaseUrl(url);

    await this._httpClient.post<DataModels.UserTasks.UserTaskResult, any>(url, userTaskResult, requestAuthHeaders);
  }

  private _createRequestAuthHeaders(identity: IIdentity): IRequestOptions {
    const noAuthTokenProvided: boolean = !identity || typeof identity.token !== 'string';
    if (noAuthTokenProvided) {
      return {};
    }

    const requestAuthHeaders: IRequestOptions = {
      headers: {
        Authorization: `Bearer ${identity.token}`,
      },
    };

    return requestAuthHeaders;
  }

  private _buildStartProcessInstanceUrl(
    processModelId: string,
    startCallbackType: DataModels.ProcessModels.StartCallbackType,
    endEventId: string,
    startEventId?: string,
  ): string {
    let url: string = restSettings.paths.startProcessInstance
      .replace(restSettings.params.processModelId, processModelId);

    url = `${url}?start_callback_type=${startCallbackType}`;

    const startEventIdIsGiven: boolean = startEventId !== undefined;
    if (startEventIdIsGiven) {
      url = `${url}&start_event_id=${startEventId}`;
    }

    const attachEndEventId: boolean = startCallbackType === DataModels.ProcessModels.StartCallbackType.CallbackOnEndEventReached;
    if (attachEndEventId) {
      url = `${url}&end_event_id=${endEventId}`;
    }

    url = this._applyBaseUrl(url);

    return url;
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
