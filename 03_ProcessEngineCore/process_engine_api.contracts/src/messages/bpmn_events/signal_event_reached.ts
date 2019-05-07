import {BaseEventMessage} from '../base_event_message';

/**
 * Encapsulates a Message for the EventAggregator, describing a
 * MessageEvent.
 */
export class SignalEventReachedMessage<TCurrentToken> extends BaseEventMessage<TCurrentToken> {

  public signalReference: string;

  constructor(
    signalReference: string,
    correlationId: string,
    processModelId: string,
    processInstanceId: string,
    flowNodeId: string,
    flowNodeInstanceId: string,
    currentToken: TCurrentToken,
  ) {
    super(correlationId, processModelId, processInstanceId, flowNodeId, flowNodeInstanceId, currentToken);

    this.signalReference = signalReference;
  }

}
