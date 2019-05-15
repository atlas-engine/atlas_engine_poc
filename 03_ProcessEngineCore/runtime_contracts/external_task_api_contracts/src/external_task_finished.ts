import {IIdentity} from '@essential-projects/iam_contracts';

import {IExternalTaskApi, IExternalTaskResult} from '.';

/**
 * Contains the result set for a successfully executed ExternalTask.
 */
export class ExternalTaskFinished<TResult> implements IExternalTaskResult {
  private readonly _externalTaskId: string;
  private readonly _result: TResult;

  constructor(externalTaskId: string, result: TResult) {
    this._externalTaskId = externalTaskId;
    this._result = result;
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
    await externalTaskApi.finishExternalTask<TResult>(identity, workerId, this._externalTaskId, this._result);
  }
}
