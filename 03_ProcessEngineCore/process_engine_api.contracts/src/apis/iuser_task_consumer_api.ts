import {IIdentity} from '@essential-projects/iam_contracts';

import {UserTask, UserTaskResult} from '../data_models/user_task/index';

/**
 * The IUserTaskConsumerApi is used to retreive and manage UserTasks.
 */
export interface IUserTaskApi {

  /**
   * Retrieves a list of all suspended UserTasks belonging to a specific
   * Correlation.
   *
   * @async
   * @param  identity            The requesting users identity.
   * @param  correlationId       The ID of the Correlation for which to
   *                             retrieve the UserTasks.
   * @returns                    A list of waiting UserTasks for the given
   *                             Correlation.
   *                             Will be empty, if none are available.
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   * @throws {ForbiddenError}    If the user is not allowed to access the
   *                             Correlation.
   */
  getUserTasksForCorrelation<TTokenPayload>(identity: IIdentity, correlationId: string): Promise<Array<UserTask<TTokenPayload>>>;

  /**
   * Finishes a UserTask belonging to an instance of a specific ProcessModel
   * within a Correlation.
   *
   * @async
   * @param  identity           The requesting users identity.
   * @param  processInstanceId  The ID of the ProcessInstance for which to finish
   *                            a UserTask.
   * @param  correlationId      The ID of the Correlation for which to finish a
   *                            UserTask.
   * @param  userTaskInstanceId The instance ID of UserTask to finish.
   * @param  userTaskResult     Contains a set of results with which to finish
   *                            the UserTask.
   *
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   * @throws {ForbiddenError}    If the user is not allowed to access the
   *                             UserTask.
   * @throws {NotFoundError}     If the ProcessInstance, the Correlation,
   *                             or the UserTask was not found.
   */
  finishUserTask(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    userTaskInstanceId: string,
    userTaskResult: UserTaskResult,
  ): Promise<void>;
}
