/* eslint-disable require-await */
import {IIdentity} from '@essential-projects/iam_contracts';
import {APIs, DataModels} from '@process-engine/process_engine_api.contracts';

export class UserTaskApiService implements APIs.IUserTaskApi {

  private readonly userTaskRepository: APIs.IUserTaskApi;

  constructor(userTaskRepository: APIs.IUserTaskApi) {
    this.userTaskRepository = userTaskRepository;
  }

  public async getUserTasksForCorrelation<TTokenPayload>(
    identity: IIdentity,
    correlationId: string,
  ): Promise<Array<DataModels.UserTasks.UserTask<TTokenPayload>>> {

    return this.userTaskRepository.getUserTasksForCorrelation<TTokenPayload>(identity, correlationId);
  }

  public async finishUserTask(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    userTaskInstanceId: string,
    userTaskResult?: DataModels.UserTasks.UserTaskResult,
  ): Promise<void> {

    return this.userTaskRepository.finishUserTask(identity, processInstanceId, correlationId, userTaskInstanceId, userTaskResult);
  }

}
