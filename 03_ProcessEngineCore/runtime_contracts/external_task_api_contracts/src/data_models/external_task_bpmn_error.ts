import {IIdentity} from '@essential-projects/iam_contracts';

import {IExternalTaskApi, IExternalTaskResult} from '../index';

/**
 * Contains the result set for an ExternalTask that failed with an Error.
 */
export class ExternalTaskBpmnError implements IExternalTaskResult {

  private readonly externalTaskId: string;
  private readonly errorCode: string;

  constructor(externalTaskId: string, errorCode: string) {
    this.externalTaskId = externalTaskId;
    this.errorCode = errorCode;
  }

  /**
   * Sends the ExternalTasks result to the ExternalTaskAPI, using the given 'IExternalTaskAPI' instance.
   *
   * @async
   * @param externalTaskApi    The ExternalTaskAPI instance that should process the ExternalTasks result.
   * @param identity           The identity to use for sending the ExternalTasks result.
   * @param workerId           Id of the Worker wich handled this tasks.
   */
  public async sendToExternalTaskApi(externalTaskApi: IExternalTaskApi, identity: IIdentity, workerId: string): Promise<void> {
    await externalTaskApi.handleBpmnError(identity, workerId, this.externalTaskId, this.errorCode);
  }

}
