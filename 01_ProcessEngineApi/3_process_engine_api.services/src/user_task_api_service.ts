/* eslint @typescript-eslint/no-explicit-any: ["off"] */
import * as EssentialProjectErrors from '@essential-projects/errors_ts';
import {IEventAggregator} from '@essential-projects/event_aggregator_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';
import {
  APIs,
  DataModels,
  Messages,
  Repositories,
} from '@process-engine/process_engine_api.contracts';
import {FlowNodeInstance} from '@process-engine/flow_node_instance.contracts';
import {FinishUserTaskMessage as InternalFinishUserTaskMessage} from '@process-engine/process_engine_contracts';

import {UserTaskConverter} from './converters/index';

export class UserTaskApiService implements APIs.IUserTaskApi {

  private readonly eventAggregator: IEventAggregator;

  private readonly userTaskConverter: UserTaskConverter;
  private readonly userTaskRepository: Repositories.IUserTaskRepository;

  constructor(
    eventAggregator: IEventAggregator,
    userTaskConverter: UserTaskConverter,
    userTaskRepository: Repositories.IUserTaskRepository,
  ) {
    this.eventAggregator = eventAggregator;
    this.userTaskConverter = userTaskConverter;
    this.userTaskRepository = userTaskRepository;
  }

  public async getUserTasksForCorrelation<TTokenPayload>(
    identity: IIdentity,
    correlationId: string,
  ): Promise<Array<DataModels.UserTasks.UserTask<TTokenPayload>>> {

    const suspendedFlowNodes = await this.userTaskRepository.getSuspendedFlowNodeInstancesInCorrelation(correlationId);

    const userTaskList = await this.userTaskConverter.convertUserTasks<TTokenPayload>(identity, suspendedFlowNodes);

    return userTaskList;
  }

  public async finishUserTask<TTokenPayload>(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    userTaskInstanceId: string,
    userTaskResult?: DataModels.UserTasks.UserTaskResult,
  ): Promise<void> {

    const resultForProcessEngine = this.createUserTaskResultForProcessEngine(userTaskResult);

    const matchingFlowNodeInstance =
      await this.getFlowNodeInstanceForCorrelationInProcessInstance(correlationId, processInstanceId, userTaskInstanceId);

    const noMatchingInstanceFound = matchingFlowNodeInstance === undefined;
    if (noMatchingInstanceFound) {
      const errorMessage =
        `ProcessInstance '${processInstanceId}' in Correlation '${correlationId}' does not have a UserTask with id '${userTaskInstanceId}'`;
      throw new EssentialProjectErrors.NotFoundError(errorMessage);
    }

    const convertedUserTaskList = await this.userTaskConverter.convertUserTasks<TTokenPayload>(identity, [matchingFlowNodeInstance]);

    const matchingUserTask = convertedUserTaskList[0];

    return new Promise<void>((resolve: Function): void => {

      const userTaskFinishedEvent = Messages.EventAggregatorSettings.messagePaths.userTaskWithInstanceIdFinished
        .replace(Messages.EventAggregatorSettings.messageParams.correlationId, correlationId)
        .replace(Messages.EventAggregatorSettings.messageParams.processInstanceId, processInstanceId)
        .replace(Messages.EventAggregatorSettings.messageParams.flowNodeInstanceId, userTaskInstanceId);

      this.eventAggregator.subscribeOnce(userTaskFinishedEvent, (): void => {
        resolve();
      });

      this.publishFinishUserTaskEvent(identity, matchingUserTask, resultForProcessEngine);
    });
  }

  private async getFlowNodeInstanceForCorrelationInProcessInstance(
    correlationId: string,
    processInstanceId: string,
    instanceId: string,
  ): Promise<FlowNodeInstance> {

    const suspendedFlowNodeInstances = await this.userTaskRepository.getSuspendedFlowNodeInstancesInProcessInstance(processInstanceId);

    const matchingInstance = suspendedFlowNodeInstances.find((instance: FlowNodeInstance): boolean => {
      return instance.id === instanceId &&
             instance.correlationId === correlationId;
    });

    return matchingInstance;
  }

  private createUserTaskResultForProcessEngine(finishedTask: DataModels.UserTasks.UserTaskResult): any {

    const noResultsProvided = !finishedTask || !finishedTask.formFields;
    if (noResultsProvided) {
      return {};
    }

    const formFieldResultIsNotAnObject = typeof finishedTask !== 'object'
      || typeof finishedTask.formFields !== 'object'
      || Array.isArray(finishedTask.formFields);

    if (formFieldResultIsNotAnObject) {
      throw new EssentialProjectErrors.BadRequestError('The UserTask\'s FormFields are not an object.');
    }

    return finishedTask.formFields;
  }

  private publishFinishUserTaskEvent<TTokenPayload>(
    identity: IIdentity,
    userTaskInstance: DataModels.UserTasks.UserTask<TTokenPayload>,
    userTaskResult: any,
  ): void {

    const finishUserTaskMessage = new InternalFinishUserTaskMessage(
      userTaskResult,
      userTaskInstance.correlationId,
      userTaskInstance.processModelId,
      userTaskInstance.processInstanceId,
      userTaskInstance.id,
      userTaskInstance.flowNodeInstanceId,
      identity,
      userTaskInstance.tokenPayload,
    );

    const finishUserTaskEvent = Messages.EventAggregatorSettings.messagePaths.finishUserTask
      .replace(Messages.EventAggregatorSettings.messageParams.correlationId, userTaskInstance.correlationId)
      .replace(Messages.EventAggregatorSettings.messageParams.processInstanceId, userTaskInstance.processInstanceId)
      .replace(Messages.EventAggregatorSettings.messageParams.flowNodeInstanceId, userTaskInstance.flowNodeInstanceId);

    this.eventAggregator.publish(finishUserTaskEvent, finishUserTaskMessage);
  }

}
