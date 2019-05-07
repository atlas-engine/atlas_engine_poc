import {BaseEventMessage} from '../base_event_message';

/**
 * The message sent when a UserTask has been reached.
 */
export class UserTaskReachedMessage<TCurrentToken> extends BaseEventMessage<TCurrentToken> {}
