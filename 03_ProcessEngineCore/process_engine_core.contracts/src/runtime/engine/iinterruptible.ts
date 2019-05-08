import {ProcessToken} from '../types/process_token';

/**
 * The signature for the interruption callback function.
 * This callback can be used by the derived FlowNodeHandlers to perform cleanup
 * operations after being interrupted.
 */
export type onInterruptionCallback = (interruptionToken: ProcessToken) => void | Promise<void>;

/**
 * Contains function definitions for interrupting a FlowNodeHandler.
 */
export interface IInterruptible {
  /**
   * This will interrupt the execution of a FlowNodeHandler, causing it to cease all
   * function and exiting.
   * Activities can be interrupted by BoundaryEvents or TerminateEndEvents.
   *
   * @param token     The current ProcessToken.
   * @param terminate Optional: If set to true, the activity will terminate,
   *                  rather than finish regularily.
   */
  interrupt(token: ProcessToken, terminate?: boolean): void | Promise<void>;
}
