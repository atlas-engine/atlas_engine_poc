import {Logger} from 'loggerhythm';
import * as uuid from 'uuid';

import {IIdentity} from '@essential-projects/iam_contracts';
import {
  ExternalTask,
  HandleExternalTaskAction,
  IExternalTaskApi,
  IExternalTaskWorker,
} from '@process-engine/external_task_api_contracts';

const logger: Logger = Logger.createLogger('pprocessengine:external_task:worker');

export class ExternalTaskWorker implements IExternalTaskWorker {

  public readonly workerId = uuid.v4();

  private readonly lockDuration = 30000;
  private readonly externalTaskApi: IExternalTaskApi;

  constructor(externalTaskApi: IExternalTaskApi) {
    this.externalTaskApi = externalTaskApi;
  }

  public async waitForAndHandle<TPayload>(
    identity: IIdentity,
    topic: string,
    maxTasks: number,
    longpollingTimeout: number,
    handleAction: HandleExternalTaskAction<TPayload>,
  ): Promise<void> {

    const keepPolling = true;
    while (keepPolling) {

      const externalTasks = await this.fetchAndLockExternalTasks<TPayload>(identity, topic, maxTasks, longpollingTimeout);

      const interval = setInterval(async (): Promise<void> => this.extendLocks<TPayload>(identity, externalTasks), this.lockDuration - 5000);

      const executeTaskPromises: Array<Promise<void>> = [];

      for (const externalTask of externalTasks) {
        executeTaskPromises.push(this.executeExternalTask(identity, externalTask, handleAction));
      }

      await Promise.all(executeTaskPromises);

      clearInterval(interval);
    }
  }

  private async fetchAndLockExternalTasks<TPayload>(
    identity: IIdentity,
    topic: string,
    maxTasks: number,
    longpollingTimeout: number,
  ): Promise<Array<ExternalTask<TPayload>>> {

    try {
      return await this.externalTaskApi.fetchAndLockExternalTasks<TPayload>(
        identity,
        this.workerId,
        topic,
        maxTasks,
        longpollingTimeout,
        this.lockDuration,
      );
    } catch (error) {

      logger.error(error);
      await this.sleep(1000);

      return this.fetchAndLockExternalTasks<TPayload>(identity, topic, maxTasks, longpollingTimeout);
    }
  }

  private async executeExternalTask<TPayload>(
    identity: IIdentity,
    externalTask: ExternalTask<TPayload>,
    handleAction: HandleExternalTaskAction<TPayload>,
  ): Promise<void> {

    try {
      const result = await handleAction(externalTask);
      await result.sendToExternalTaskApi(this.externalTaskApi, identity, this.workerId);
    } catch (error) {
      logger.error(error);
      await this.externalTaskApi.handleServiceError(identity, this.workerId, externalTask.id, error.message, '');
    }
  }

  private async extendLocks<TPayload>(identity: IIdentity, externalTasks: Array<ExternalTask<TPayload>>): Promise<void> {
    for (const externalTask of externalTasks) {
      await this.externalTaskApi.extendLock(identity, this.workerId, externalTask.id, this.lockDuration);
    }
  }

  private async sleep(milliseconds: number): Promise<void> {
    return new Promise<void>((resolve: Function): void => {
      setTimeout((): void => resolve(), milliseconds);
    });
  }

}