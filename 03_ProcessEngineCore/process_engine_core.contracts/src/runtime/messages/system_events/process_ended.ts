import {IIdentity} from '@essential-projects/iam_contracts';

import {BaseSystemEventMessage} from './base_system_event_message';

/**
 * The message which is send, when a new ProcessInstance finished.
 */
export class ProcessEndedMessage extends BaseSystemEventMessage {

  constructor(correlationId: string,
              processModelId: string,
              processInstanceId: string,
              startEventId: string,
              startEventInstanceId: string,
              processInstanceOwner: IIdentity,
              currentToken: any) {
    super(correlationId, processModelId, processInstanceId, startEventId, startEventInstanceId, processInstanceOwner, currentToken);
  }
}
