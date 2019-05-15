import {IIdentity} from '@essential-projects/iam_contracts';

import {CorrelationState} from './correlation_state';

/**
 * Describes a Correlation, as it is stored in the CorrelationRepository.
 */
export class CorrelationFromRepository {
  public id: string;
  public processModelHash: string;
  public processModelId: string;
  public processInstanceId: string;
  public parentProcessInstanceId?: string;
  public state: CorrelationState;
  public error: Error;
  public identity: IIdentity;
  public createdAt: Date;
  public updatedAt: Date;
}
