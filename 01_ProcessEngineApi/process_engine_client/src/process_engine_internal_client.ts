import * as EssentialProjectErrors from '@essential-projects/errors_ts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {APIs, DataModels, IProcessEngineClient} from '@process-engine/process_engine_api.contracts';

export class InternalAccessor implements IProcessEngineClient {

  private processModelApiService: APIs.IProcessModelApi = undefined;
  private userTaskApiService: APIs.IUserTaskApi = undefined;

  constructor(processModelApiService: APIs.IProcessModelApi, userTaskApiService: APIs.IUserTaskApi) {
    this.processModelApiService = processModelApiService;
    this.userTaskApiService = userTaskApiService;
  }

  // Process models and instances
  public async getProcessModels(identity: IIdentity): Promise<DataModels.ProcessModels.ProcessModelList> {
    this.ensureIsAuthorized(identity);

    return this.processModelApiService.getProcessModels(identity);
  }

  public async getProcessModelById(identity: IIdentity, processModelId: string): Promise<DataModels.ProcessModels.ProcessModel> {
    this.ensureIsAuthorized(identity);

    return this.processModelApiService.getProcessModelById(identity, processModelId);
  }

  public async startProcessInstance(
    identity: IIdentity,
    processModelId: string,
    payload: DataModels.ProcessModels.ProcessStartRequestPayload,
    startCallbackType?: DataModels.ProcessModels.StartCallbackType,
    startEventId?: string,
    endEventId?: string,
  ): Promise<DataModels.ProcessModels.ProcessStartResponsePayload> {
    this.ensureIsAuthorized(identity);

    return this.processModelApiService.startProcessInstance(identity, processModelId, payload, startCallbackType, startEventId, endEventId);
  }

  // UserTasks
  public async getUserTasksForCorrelation(identity: IIdentity, correlationId: string): Promise<DataModels.UserTasks.UserTaskList> {
    this.ensureIsAuthorized(identity);

    return this.userTaskApiService.getUserTasksForCorrelation(identity, correlationId);
  }

  public async finishUserTask(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    userTaskInstanceId: string,
    userTaskResult: DataModels.UserTasks.UserTaskResult,
  ): Promise<void> {
    this.ensureIsAuthorized(identity);

    return this.userTaskApiService.finishUserTask(identity, processInstanceId, correlationId, userTaskInstanceId, userTaskResult);
  }

  private ensureIsAuthorized(identity: IIdentity): void {
    const noAuthTokenProvided: boolean = !identity || typeof identity.token !== 'string';
    if (noAuthTokenProvided) {
      throw new EssentialProjectErrors.UnauthorizedError('No auth token provided!');
    }
  }

}
