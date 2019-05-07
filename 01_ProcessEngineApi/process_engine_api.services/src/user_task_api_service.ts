/* eslint @typescript-eslint/no-explicit-any: ["off"] */
import * as EssentialProjectErrors from '@essential-projects/errors_ts';
import {IEventAggregator} from '@essential-projects/event_aggregator_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';
import {APIs, DataModels, Messages} from '@process-engine/process_engine_api.contracts';
import {
  FlowNodeInstance,
  IFlowNodeInstanceService,
} from '@process-engine/flow_node_instance.contracts';
import {FinishUserTaskMessage as InternalFinishUserTaskMessage} from '@process-engine/process_engine_contracts';

import {UserTaskConverter} from './converters/index';

export class UserTaskApiService implements APIs.IUserTaskApi {

  private readonly eventAggregator: IEventAggregator;
  private readonly flowNodeInstanceService: IFlowNodeInstanceService;

  private readonly userTaskConverter: UserTaskConverter;

  constructor(
    eventAggregator: IEventAggregator,
    flowNodeInstanceService: IFlowNodeInstanceService,
    userTaskConverter: UserTaskConverter,
  ) {
    this.eventAggregator = eventAggregator;
    this.flowNodeInstanceService = flowNodeInstanceService;
    this.userTaskConverter = userTaskConverter;
  }

  public async getUserTasksForCorrelation<TTokenPayload>(
    identity: IIdentity,
    correlationId: string,
  ): Promise<Array<DataModels.UserTasks.UserTask<TTokenPayload>>> {

    const suspendedFlowNodes: Array<FlowNodeInstance> =
      await this.flowNodeInstanceService.querySuspendedByCorrelation(correlationId);

    const userTaskList: Array<DataModels.UserTasks.UserTask<TTokenPayload>> =
      await this.userTaskConverter.convertUserTasks<TTokenPayload>(identity, suspendedFlowNodes);

    return userTaskList;
  }

  public async finishUserTask<TTokenPayload>(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    userTaskInstanceId: string,
    userTaskResult?: DataModels.UserTasks.UserTaskResult,
  ): Promise<void> {

    const resultForProcessEngine: any = this.createUserTaskResultForProcessEngine(userTaskResult);

    const matchingFlowNodeInstance: FlowNodeInstance =
      await this.getFlowNodeInstanceForCorrelationInProcessInstance(correlationId, processInstanceId, userTaskInstanceId);

    const noMatchingInstanceFound: boolean = matchingFlowNodeInstance === undefined;
    if (noMatchingInstanceFound) {
      const errorMessage: string =
        `ProcessInstance '${processInstanceId}' in Correlation '${correlationId}' does not have a UserTask with id '${userTaskInstanceId}'`;
      throw new EssentialProjectErrors.NotFoundError(errorMessage);
    }

    const convertedUserTaskList: Array<DataModels.UserTasks.UserTask<TTokenPayload>> =
      await this.userTaskConverter.convertUserTasks<TTokenPayload>(identity, [matchingFlowNodeInstance]);

    const matchingUserTask: DataModels.UserTasks.UserTask<TTokenPayload> = convertedUserTaskList[0];

    return new Promise<void>((resolve: Function): void => {

      const userTaskFinishedEvent: string = Messages.EventAggregatorSettings.messagePaths.userTaskWithInstanceIdFinished
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

    const suspendedFlowNodeInstances: Array<FlowNodeInstance> =
      await this.flowNodeInstanceService.querySuspendedByProcessInstance(processInstanceId);

    const matchingInstance: FlowNodeInstance = suspendedFlowNodeInstances.find((instance: FlowNodeInstance): boolean => {
      return instance.id === instanceId &&
             instance.correlationId === correlationId;
    });

    return matchingInstance;
  }

  private createUserTaskResultForProcessEngine(finishedTask: DataModels.UserTasks.UserTaskResult): any {

    const noResultsProvided: boolean = !finishedTask || !finishedTask.formFields;

    if (noResultsProvided) {
      return {};
    }

    const formFieldResultIsNotAnObject: boolean = typeof finishedTask !== 'object'
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

    const finishUserTaskMessage: InternalFinishUserTaskMessage =
      new InternalFinishUserTaskMessage(
        userTaskResult,
        userTaskInstance.correlationId,
        userTaskInstance.processModelId,
        userTaskInstance.processInstanceId,
        userTaskInstance.id,
        userTaskInstance.flowNodeInstanceId,
        identity,
        userTaskInstance.tokenPayload,
      );

    const finishUserTaskEvent: string = Messages.EventAggregatorSettings.messagePaths.finishUserTask
      .replace(Messages.EventAggregatorSettings.messageParams.correlationId, userTaskInstance.correlationId)
      .replace(Messages.EventAggregatorSettings.messageParams.processInstanceId, userTaskInstance.processInstanceId)
      .replace(Messages.EventAggregatorSettings.messageParams.flowNodeInstanceId, userTaskInstance.flowNodeInstanceId);

    this.eventAggregator.publish(finishUserTaskEvent, finishUserTaskMessage);
  }

}
