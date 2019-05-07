import {BaseEventMessage} from '../base_event_message';

/**
 * Encapsulates a Message for the EventAggregator, describing a
 * MessageEvent.
 */
export class MessageEventReachedMessage<TCurrentToken> extends BaseEventMessage<TCurrentToken> {

  public messageReference: string;

  constructor(
    messageReference: string,
    correlationId: string,
    processModelId: string,
    processInstanceId: string,
    flowNodeId: string,
    flowNodeInstanceId: string,
    currentToken: TCurrentToken,
  ) {
    super(correlationId, processModelId, processInstanceId, flowNodeId, flowNodeInstanceId, currentToken);

    this.messageReference = messageReference;
  }

}
