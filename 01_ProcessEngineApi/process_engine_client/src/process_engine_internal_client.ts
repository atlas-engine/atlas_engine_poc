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
  public async getProcessModels(identity: IIdentity): Promise<Array<DataModels.ProcessModels.ProcessModel>> {
    this.ensureIsAuthorized(identity);

    return this.processModelApiService.getProcessModels(identity);
  }

  public async getProcessModelById(identity: IIdentity, processModelId: string): Promise<DataModels.ProcessModels.ProcessModel> {
    this.ensureIsAuthorized(identity);

    return this.processModelApiService.getProcessModelById(identity, processModelId);
  }

  public async startProcessInstance<TInputValues>(
    identity: IIdentity,
    processModelId: string,
    payload: DataModels.ProcessModels.ProcessStartRequestPayload<TInputValues>,
    startCallbackType?: DataModels.ProcessModels.StartCallbackType,
    startEventId?: string,
    endEventId?: string,
  ): Promise<DataModels.ProcessModels.ProcessStartResponsePayload> {
    this.ensureIsAuthorized(identity);

    return this
      .processModelApiService
      .startProcessInstance<TInputValues>(identity, processModelId, payload, startCallbackType, startEventId, endEventId);
  }

  // UserTasks
  public async getUserTasksForCorrelation<TTokenPayload>(
    identity: IIdentity,
    correlationId: string,
  ): Promise<Array<DataModels.UserTasks.UserTask<TTokenPayload>>> {
    this.ensureIsAuthorized(identity);

    return this.userTaskApiService.getUserTasksForCorrelation<TTokenPayload>(identity, correlationId);
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
