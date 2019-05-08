import {Subscription} from '@essential-projects/event_aggregator_contracts';

import {FlowNode, TimerEventDefinition} from '../../model_duplications/index';
import {IProcessTokenFacade} from './iprocess_token_facade';

import {TimerDefinitionType} from '../../constants';

/**
 * Handles the creation and resolution of timers.
 */
export interface ITimerFacade {

  /**
   * Initializes a new timer for the given FlowNode, using the given type and
   * value as a baseline.
   *
   * @param   flowNode           The FlowNode to which to attach the timer.
   * @param   timerType          The type of the timer (cycle, duration, etc).
   * @param   timerValue         The value of the timer.
   * @param   callback           The function to call, after the timer has elapsed.
   * @returns                    A Subscription on the event aggreator,
   *                             which can be used to wait for the timer to elapse.
   */
  initializeTimer(
    flowNode: FlowNode,
    timerType: TimerDefinitionType,
    timerValue: string,
    callback: Function,
  ): Subscription;

  /**
   * Initializes a new timer for the given FlowNode from the given
   * timerDefinition.
   *
   * @param   flowNode           The FlowNode to which to attach the timer.
   * @param   timerDefinition    The timer definition from which to build the timer.
   * @param   processTokenFacade The ProcessTokenFacade to use to retrieve
   *                             token values for timer expressions.
   * @param   callback           The function to call, after the timer has elapsed.
   * @returns                    A Subscription on the event aggreator,
   *                             which can be used to wait for the timer to elapse.
   */
  initializeTimerFromDefinition(
    flowNode: FlowNode,
    timerDefinition: TimerEventDefinition,
    processTokenFacade: IProcessTokenFacade,
    callback: Function,
  ): Subscription;

  /**
   * Takes an event definition and parsed it into a comprehensive
   * TimerDefinitionType.
   *
   * @param   eventDefinition The event definition to parse.
   * @returns                 The parsed TimerDefinitionType.
   */
  parseTimerDefinitionType(eventDefinition: TimerEventDefinition): TimerDefinitionType;

  /**
   * Takes the given event definition and parses the attached value into
   * a format that can be understood be the timer-scheduling library.
   *
   * @param   eventDefinition The event definition to parse.
   * @returns                 The parsed timer value.
   */
  parseTimerDefinitionValue(eventDefinition: TimerEventDefinition): string;

  /**
   * Cancels the given timer subscription.
   *
   * @param subscription The subscription to cancel.
   */
  cancelTimerSubscription(subscription: Subscription): void;
}
