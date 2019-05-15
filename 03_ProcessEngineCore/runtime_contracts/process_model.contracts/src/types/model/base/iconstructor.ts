/**
 * This is a helper interface, which will allow us to create instances for
 * FlowNodes from generic functions.
 *
 * See for example:
 * https://github.com/process-engine/process_engine_core/blob/develop/src/model/parser/event_parser.ts#L156
 */
export interface IConstructor<T> {
  new (...args: Array<any>): T;
}
