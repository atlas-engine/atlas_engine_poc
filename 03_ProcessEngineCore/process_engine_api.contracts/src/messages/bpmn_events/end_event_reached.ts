import {BaseEventMessage} from '../base_event_message';

/**
 * Encapsulates a Message for the EventAggregator, describing a
 * MessageEvent.
 */
export class EndEventReachedMessage extends BaseEventMessage {

  constructor(correlationId: string,
              processModelId: string,
              processInstanceId: string,
              flowNodeId: string,
              flowNodeInstanceId: string,
              currentToken: any) {
    super(correlationId, processModelId, processInstanceId, flowNodeId, flowNodeInstanceId, currentToken);
  }
}
