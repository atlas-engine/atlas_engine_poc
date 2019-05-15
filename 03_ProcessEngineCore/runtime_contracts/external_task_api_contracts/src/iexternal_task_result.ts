import {IIdentity} from '@essential-projects/iam_contracts';

import {IExternalTaskApi} from '.';

/**
 * Contains the execution result for an ExternalTask.
 */
export interface IExternalTaskResult {

  /**
   * Sends the ExternalTasks result to the ExternalTaskAPI, using the given 'IExternalTaskAPI' instance.
   *
   * @async
   * @param externalTaskApi    The ExternalTaskAPI instance that should process the ExternalTasks result.
   * @param identity           The identity to use for sending the ExternalTasks result.
   * @param workerId           Id of the Worker wich handled this tasks.
   */
  sendToExternalTaskApi(externalTaskApi: IExternalTaskApi, identity: IIdentity, workerId: string): Promise<void>;
}
