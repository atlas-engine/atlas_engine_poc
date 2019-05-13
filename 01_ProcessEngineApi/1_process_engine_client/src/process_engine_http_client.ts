import * as EssentialProjectErrors from '@essential-projects/errors_ts';
import {IHttpClient, IRequestOptions, IResponse} from '@essential-projects/http_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {DataModels, IProcessEngineClient, restSettings} from '@process-engine/process_engine_api.contracts';

export class ProcessEngineHttpClient implements IProcessEngineClient {

  // eslint-disable-next-line
  public config: any;

  private baseUrl: string = 'api/process-engine/v1';

  private httpClient: IHttpClient = undefined;

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient;
  }

  // Process models and instances
  public async getProcessModels(identity: IIdentity): Promise<Array<DataModels.ProcessModels.ProcessModel>> {
    this.ensureIsAuthorized(identity);

    const requestAuthHeaders: IRequestOptions = this.createRequestAuthHeaders(identity);

    const url: string = this.applyBaseUrl(restSettings.paths.processModels);

    const httpResponse: IResponse<Array<DataModels.ProcessModels.ProcessModel>> =
      await this.httpClient.get<Array<DataModels.ProcessModels.ProcessModel>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getProcessModelById(identity: IIdentity, processModelId: string): Promise<DataModels.ProcessModels.ProcessModel> {
    this.ensureIsAuthorized(identity);

    const requestAuthHeaders: IRequestOptions = this.createRequestAuthHeaders(identity);

    let url: string = restSettings.paths.processModelById.replace(restSettings.params.processModelId, processModelId);
    url = this.applyBaseUrl(url);

    const httpResponse: IResponse<DataModels.ProcessModels.ProcessModel> =
      await this.httpClient.get<DataModels.ProcessModels.ProcessModel>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async startProcessInstance<TInputValues>(
    identity: IIdentity,
    processModelId: string,
    payload: DataModels.ProcessModels.ProcessStartRequestPayload<TInputValues>,
    startCallbackType: DataModels.ProcessModels.StartCallbackType,
    startEventId?: string,
    endEventId?: string,
  ): Promise<DataModels.ProcessModels.ProcessStartResponsePayload> {
    this.ensureIsAuthorized(identity);

    const url: string = this.buildStartProcessInstanceUrl(processModelId, startCallbackType, endEventId, startEventId);

    const requestAuthHeaders: IRequestOptions = this.createRequestAuthHeaders(identity);

    const httpResponse: IResponse<DataModels.ProcessModels.ProcessStartResponsePayload> =
      await this
        .httpClient
        // eslint-disable-next-line
        .post<DataModels.ProcessModels.ProcessStartRequestPayload<TInputValues>, DataModels.ProcessModels.ProcessStartResponsePayload>(url, payload, requestAuthHeaders);

    return httpResponse.result;
  }

  // UserTasks
  public async getUserTasksForCorrelation<TTokenPayload>(
    identity: IIdentity,
    correlationId: string,
  ): Promise<Array<DataModels.UserTasks.UserTask<TTokenPayload>>> {

    this.ensureIsAuthorized(identity);

    const requestAuthHeaders: IRequestOptions = this.createRequestAuthHeaders(identity);

    let url: string = restSettings.paths.correlationUserTasks.replace(restSettings.params.correlationId, correlationId);
    url = this.applyBaseUrl(url);

    const httpResponse: IResponse<Array<DataModels.UserTasks.UserTask<TTokenPayload>>> =
      await this.httpClient.get<Array<DataModels.UserTasks.UserTask<TTokenPayload>>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async finishUserTask(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    userTaskInstanceId: string,
    userTaskResult: DataModels.UserTasks.UserTaskResult,
  ): Promise<void> {
    this.ensureIsAuthorized(identity);

    const requestAuthHeaders: IRequestOptions = this.createRequestAuthHeaders(identity);

    let url: string = restSettings.paths.finishUserTask
      .replace(restSettings.params.processInstanceId, processInstanceId)
      .replace(restSettings.params.correlationId, correlationId)
      .replace(restSettings.params.userTaskInstanceId, userTaskInstanceId);

    url = this.applyBaseUrl(url);

    await this.httpClient.post<DataModels.UserTasks.UserTaskResult, void>(url, userTaskResult, requestAuthHeaders);
  }

  private createRequestAuthHeaders(identity: IIdentity): IRequestOptions {
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

  private buildStartProcessInstanceUrl(
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

    url = this.applyBaseUrl(url);

    return url;
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
