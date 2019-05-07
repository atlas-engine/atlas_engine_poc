import {UserTaskResult} from '../../data_models/user_task/user_task_result';

import {BaseEventMessage} from '../base_event_message';

/**
 * The message sent when a UserTask has been finished.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class UserTaskFinishedMessage<TCurrentToken, TUserTaskResult = any> extends BaseEventMessage<TCurrentToken> {

  /**
   * The result the UserTask was finished with.
   */
  public userTaskResult: UserTaskResult<TUserTaskResult>;

  constructor(
    userTaskResult: UserTaskResult<TUserTaskResult>,
    correlationId: string,
    processModelId: string,
    processInstanceId: string,
    flowNodeId: string,
    flowNodeInstanceId: string,
    currentToken: TCurrentToken,
  ) {
    super(correlationId, processModelId, processInstanceId, flowNodeId, flowNodeInstanceId, currentToken);

    this.userTaskResult = userTaskResult;
  }

}
