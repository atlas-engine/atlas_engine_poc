import {CorrelationProcessInstance} from './correlation_process_instance';
import {CorrelationState} from './correlation_state';

/**
 * Describes a Correlation.
 */
export class Correlation {

  public id: string;
  public processInstances: Array<CorrelationProcessInstance>;
  public state: CorrelationState;
  public error: Error;
  public createdAt?: Date;

}
