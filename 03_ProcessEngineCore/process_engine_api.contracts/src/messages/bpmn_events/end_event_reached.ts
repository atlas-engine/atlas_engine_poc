import {BaseEventMessage} from '../base_event_message';

/**
 * Encapsulates a Message for the EventAggregator, describing a
 * MessageEvent.
 */
export class EndEventReachedMessage<TCurrentToken> extends BaseEventMessage<TCurrentToken> {}
