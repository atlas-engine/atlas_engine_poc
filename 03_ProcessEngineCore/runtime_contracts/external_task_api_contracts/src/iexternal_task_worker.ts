import {IIdentity} from '@essential-projects/iam_contracts';

import {ExternalTask} from './data_models/external_task';

import {IExternalTaskResult} from '.';

/**
 * Definition of the HandleExternalTask Callback.
 */
export type HandleExternalTaskAction<TPayload> = (externalTask: ExternalTask<TPayload>) => Promise<IExternalTaskResult>

/**
 * Describes a worker that can be used to process ExternalTasks.
 */
export interface IExternalTaskWorker {

  workerId: string;

  /**
   * Periodically fetches, locks and processes available ExternalTasks with a given topic,
   * using the given callback as a processing function.
   *
   * @async
   * @param identity           The identity to use for fetching and processing ExternalTasks.
   * @param topic              The topic by which to look for and process ExternalTasks.
   * @param maxTasks           max. ExternalTasks to fetch.
   * @param longpollingTimeout Longpolling Timeout in ms.
   * @param handleAction       The function for processing the ExternalTasks.
   */
  waitForAndHandle<TPayload>(
    identity: IIdentity,
    topic: string,
    maxTasks: number,
    longpollingTimeout: number,
    handleAction: HandleExternalTaskAction<TPayload>): Promise<void>;
}
