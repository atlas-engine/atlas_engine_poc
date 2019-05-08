import {IIdentity} from '@essential-projects/iam_contracts';

import {BaseSystemEventMessage} from './base_system_event_message';

/**
 * The message which is send, when a ProcessInstance is finished with an error.
 */
export class ProcessErrorMessage extends BaseSystemEventMessage {

  constructor(correlationId: string,
              processModelId: string,
              processInstanceId: string,
              flowNodeId: string,
              flowNodeInstanceId: string,
              processInstanceOwner: IIdentity,
              currentToken: any) {
    super(correlationId, processModelId, processInstanceId, flowNodeId, flowNodeInstanceId, processInstanceOwner, currentToken);
  }
}
