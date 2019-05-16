/* eslint-disable no-param-reassign */
import * as moment from 'moment';

import * as EssentialProjectErrors from '@essential-projects/errors_ts';
import {IIAMService, IIdentity} from '@essential-projects/iam_contracts';

import {Repositories, Services, Types} from '@process-engine/persistence_api.contracts';

export class ExternalTaskApiService implements Services.IExternalTaskService {

  private readonly externalTaskRepository: Repositories.IExternalTaskRepository;
  private readonly iamService: IIAMService;

  private readonly canAccessExternalTasksClaim: string = 'can_access_external_tasks';

  constructor(externalTaskRepository: Repositories.IExternalTaskRepository, iamService: IIAMService) {
    this.externalTaskRepository = externalTaskRepository;
    this.iamService = iamService;
  }

  public async fetchAndLockExternalTasks<TPayload>(
    identity: IIdentity,
    workerId: string,
    topicName: string,
    maxTasks: number,
    longPollingTimeout: number,
    lockDuration: number,
  ): Promise<Array<Types.ExternalTask.ExternalTask<TPayload>>> {

    await this.iamService.ensureHasClaim(identity, this.canAccessExternalTasksClaim);

    const tasks = await this.externalTaskRepository.fetchAvailableForProcessing<TPayload>(topicName, maxTasks);

    const lockExpirationTime = this.getLockExpirationDate(lockDuration);

    const lockedTasks =
      // eslint-disable-next-line max-len
      await Promise.map(tasks, async (externalTask: Types.ExternalTask.ExternalTask<TPayload>): Promise<Types.ExternalTask.ExternalTask<TPayload>> => {
        return this.lockExternalTask<TPayload>(externalTask, workerId, lockExpirationTime);
      });

    return lockedTasks;
  }

  public async extendLock(identity: IIdentity, workerId: string, externalTaskId: string, additionalDuration: number): Promise<void> {

    await this.iamService.ensureHasClaim(identity, this.canAccessExternalTasksClaim);

    // Note: The type of the initial payload is irrelevant for lock extension.
    const externalTask = await this.externalTaskRepository.getById(externalTaskId);

    this.ensureExternalTaskCanBeAccessedByWorker(externalTask, externalTaskId, workerId);

    const newLockExpirationTime = this.getLockExpirationDate(additionalDuration);

    return this.externalTaskRepository.lockForWorker(workerId, externalTaskId, newLockExpirationTime);
  }

  public async handleBpmnError(identity: IIdentity, workerId: string, externalTaskId: string, errorCode: string): Promise<void> {

    await this.iamService.ensureHasClaim(identity, this.canAccessExternalTasksClaim);

    // Note: The type of the initial payload is irrelevant for finishing with an error.
    const externalTask = await this.externalTaskRepository.getById(externalTaskId);

    this.ensureExternalTaskCanBeAccessedByWorker(externalTask, externalTaskId, workerId);

    const error = new EssentialProjectErrors.InternalServerError(`ExternalTask failed due to BPMN error with code ${errorCode}`);

    await this.externalTaskRepository.finishWithError(externalTaskId, error);
  }

  public async handleServiceError(
    identity: IIdentity,
    workerId: string,
    externalTaskId: string,
    errorMessage: string,
    errorDetails: string,
  ): Promise<void> {

    await this.iamService.ensureHasClaim(identity, this.canAccessExternalTasksClaim);

    // Note: The type of the initial payload is irrelevant for finishing with an error.
    const externalTask = await this.externalTaskRepository.getById(externalTaskId);

    this.ensureExternalTaskCanBeAccessedByWorker(externalTask, externalTaskId, workerId);

    const error = new EssentialProjectErrors.InternalServerError(errorMessage);
    error.additionalInformation = errorDetails;

    await this.externalTaskRepository.finishWithError(externalTaskId, error);
  }

  public async finishExternalTask<TResultType>(
    identity: IIdentity,
    workerId: string,
    externalTaskId: string,
    payload: TResultType,
  ): Promise<void> {

    await this.iamService.ensureHasClaim(identity, this.canAccessExternalTasksClaim);

    // Note: The type of the initial payload is irrelevant for providing a final result.
    const externalTask = await this.externalTaskRepository.getById(externalTaskId);

    this.ensureExternalTaskCanBeAccessedByWorker(externalTask, externalTaskId, workerId);

    await this.externalTaskRepository.finishWithSuccess<TResultType>(externalTaskId, payload);
  }

  private async lockExternalTask<TPayload>(
    externalTask: Types.ExternalTask.ExternalTask<TPayload>,
    workerId: string,
    lockExpirationTime: Date,
  ): Promise<Types.ExternalTask.ExternalTask<TPayload>> {

    await this.externalTaskRepository.lockForWorker(workerId, externalTask.id, lockExpirationTime);

    externalTask.workerId = workerId;
    externalTask.lockExpirationTime = lockExpirationTime;

    return externalTask;
  }

  private ensureExternalTaskCanBeAccessedByWorker<TPayload>(
    externalTask: Types.ExternalTask.ExternalTask<TPayload>,
    externalTaskId: string,
    workerId: string,
  ): void {

    const externalTaskDoesNotExist = !externalTask;
    if (externalTaskDoesNotExist) {
      throw new EssentialProjectErrors.NotFoundError(`External Task with ID '${externalTaskId}' not found.`);
    }

    const externalTaskIsAlreadyFinished = externalTask.state === Types.ExternalTask.ExternalTaskState.finished;
    if (externalTaskIsAlreadyFinished) {
      throw new EssentialProjectErrors.GoneError(`External Task with ID '${externalTaskId}' has been finished and is no longer accessible.`);
    }

    const now = moment();
    const taskReleaseTime = moment(externalTask.lockExpirationTime);

    const externalTaskIsLockedByOtherWorker = externalTask.workerId !== workerId && now.isBefore(taskReleaseTime);
    if (externalTaskIsLockedByOtherWorker) {
      const msg = `External Task with ID '${externalTaskId}' is locked by another worker, until ${taskReleaseTime.toISOString()}.`;
      throw new EssentialProjectErrors.LockedError(msg);
    }
  }

  /**
   * Takes the given duration in ms and adds it to the current datetime.
   * The result is returned as a date which can be used as an unlock date.
   *
   * @param   duration The duration in ms to use for the new unlock date.
   * @returns          The calculated lockout date.
   */
  private getLockExpirationDate(duration: number): Date {
    return moment()
      .add(duration, 'milliseconds')
      .toDate();
  }

}
