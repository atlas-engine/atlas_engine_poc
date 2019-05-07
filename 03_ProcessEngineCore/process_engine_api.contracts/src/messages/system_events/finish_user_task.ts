import {UserTaskResult} from '../../data_models/user_task';
import {BaseEventMessage} from '../base_event_message';

/**
 * The message used to finish a waiting UserTask.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class FinishUserTaskMessage<TCurrentToken> extends BaseEventMessage<TCurrentToken> {

  /**
   * The flow node id of the UserTask being finished.
   */
  public userTaskId: string;
  /**
   * The result the UserTask should be finished with.
   */
  public result: UserTaskResult;

  constructor(
    result: UserTaskResult,
    correlationId: string,
    processModelId: string,
    processInstanceId: string,
    flowNodeId: string,
    flowNodeInstanceId: string,
    currentToken: TCurrentToken,
  ) {
    super(correlationId, processModelId, processInstanceId, flowNodeId, flowNodeInstanceId, currentToken);

    this.result = result;
  }

}
