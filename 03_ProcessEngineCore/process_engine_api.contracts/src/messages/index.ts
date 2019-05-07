/* eslint-disable @typescript-eslint/no-unused-vars */
import * as bpmnEvents from './bpmn_events/index';
import * as systemEvents from './system_events/index';

import * as baseEventMessage from './base_event_message';
import * as eventAggregatorSettings from './event_aggregator_settings';

export namespace Messages {
  export import BaseEventMessage = baseEventMessage.BaseEventMessage;
  export import BpmnEvents = bpmnEvents;
  export import EventAggregatorSettings = eventAggregatorSettings;
  export import SystemEvents = systemEvents;
}
