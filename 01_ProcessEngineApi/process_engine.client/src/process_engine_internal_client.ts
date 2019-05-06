import * as EssentialProjectErrors from '@essential-projects/errors_ts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {
  DataModels,
  IConsumerApi,
  IConsumerApiAccessor,
} from '@process-engine/consumer_api_contracts';

export class InternalAccessor implements IConsumerApiAccessor {

  private _consumerApiService: IConsumerApi = undefined;

  constructor(consumerApiService: IConsumerApi) {
    this._consumerApiService = consumerApiService;
  }

  // Process models and instances
  public async getProcessModels(identity: IIdentity): Promise<DataModels.ProcessModels.ProcessModelList> {
    this._ensureIsAuthorized(identity);

    return this._consumerApiService.getProcessModels(identity);
  }

  public async getProcessModelById(identity: IIdentity, processModelId: string): Promise<DataModels.ProcessModels.ProcessModel> {
    this._ensureIsAuthorized(identity);

    return this._consumerApiService.getProcessModelById(identity, processModelId);
  }

  public async startProcessInstance(
    identity: IIdentity,
    processModelId: string,
    payload: DataModels.ProcessModels.ProcessStartRequestPayload,
    startCallbackType?: DataModels.ProcessModels.StartCallbackType,
    startEventId?: string,
    endEventId?: string,
  ): Promise<DataModels.ProcessModels.ProcessStartResponsePayload> {
    this._ensureIsAuthorized(identity);

    return this._consumerApiService.startProcessInstance(identity, processModelId, payload, startCallbackType, startEventId, endEventId);
  }

  // UserTasks
  public async getUserTasksForCorrelation(identity: IIdentity, correlationId: string): Promise<DataModels.UserTasks.UserTaskList> {
    this._ensureIsAuthorized(identity);

    return this._consumerApiService.getUserTasksForCorrelation(identity, correlationId);
  }

  public async finishUserTask(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    userTaskInstanceId: string,
    userTaskResult: DataModels.UserTasks.UserTaskResult,
  ): Promise<void> {
    this._ensureIsAuthorized(identity);

    return this._consumerApiService.finishUserTask(identity, processInstanceId, correlationId, userTaskInstanceId, userTaskResult);
  }

  private _ensureIsAuthorized(identity: IIdentity): void {
    const noAuthTokenProvided: boolean = !identity || typeof identity.token !== 'string';
    if (noAuthTokenProvided) {
      throw new EssentialProjectErrors.UnauthorizedError('No auth token provided!');
    }
  }
}
