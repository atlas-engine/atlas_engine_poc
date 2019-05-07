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
  public config: any = undefined;

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

  // UserTasks
  public async getUserTasksForCorrelation(identity: IIdentity, correlationId: string): Promise<DataModels.UserTasks.UserTaskList> {

    const suspendedFlowNodes: Array<FlowNodeInstance> =
      await this.flowNodeInstanceService.querySuspendedByCorrelation(correlationId);

    const userTaskList: DataModels.UserTasks.UserTaskList = await this.userTaskConverter.convertUserTasks(identity, suspendedFlowNodes);

    return userTaskList;
  }

  public async finishUserTask(
    identity: IIdentity,
    processInstanceId: string,
    correlationId: string,
    userTaskInstanceId: string,
    userTaskResult?: DataModels.UserTasks.UserTaskResult,
  ): Promise<void> {

    const resultForProcessEngine: any = this._createUserTaskResultForProcessEngine(userTaskResult);

    const matchingFlowNodeInstance: FlowNodeInstance =
      await this._getFlowNodeInstanceForCorrelationInProcessInstance(correlationId, processInstanceId, userTaskInstanceId);

    const noMatchingInstanceFound: boolean = matchingFlowNodeInstance === undefined;
    if (noMatchingInstanceFound) {
      const errorMessage: string =
        `ProcessInstance '${processInstanceId}' in Correlation '${correlationId}' does not have a UserTask with id '${userTaskInstanceId}'`;
      throw new EssentialProjectErrors.NotFoundError(errorMessage);
    }

    const convertedUserTaskList: DataModels.UserTasks.UserTaskList =
      await this.userTaskConverter.convertUserTasks(identity, [matchingFlowNodeInstance]);

    const matchingUserTask: DataModels.UserTasks.UserTask = convertedUserTaskList.userTasks[0];

    return new Promise<void>((resolve: Function): void => {

      const userTaskFinishedEvent: string = Messages.EventAggregatorSettings.messagePaths.userTaskWithInstanceIdFinished
        .replace(Messages.EventAggregatorSettings.messageParams.correlationId, correlationId)
        .replace(Messages.EventAggregatorSettings.messageParams.processInstanceId, processInstanceId)
        .replace(Messages.EventAggregatorSettings.messageParams.flowNodeInstanceId, userTaskInstanceId);

      this.eventAggregator.subscribeOnce(userTaskFinishedEvent, () => {
        resolve();
      });

      this._publishFinishUserTaskEvent(identity, matchingUserTask, resultForProcessEngine);
    });
  }

  private async _getFlowNodeInstanceForCorrelationInProcessInstance(
    correlationId: string,
    processInstanceId: string,
    instanceId: string,
  ): Promise<FlowNodeInstance> {

    const suspendedFlowNodeInstances: Array<FlowNodeInstance> =
      await this.flowNodeInstanceService.querySuspendedByProcessInstance(processInstanceId);

    const matchingInstance: FlowNodeInstance = suspendedFlowNodeInstances.find((instance: FlowNodeInstance) => {
      return instance.id === instanceId &&
             instance.correlationId === correlationId;
    });

    return matchingInstance;
  }

  private _createUserTaskResultForProcessEngine(finishedTask: DataModels.UserTasks.UserTaskResult): any {

    const noResultsProvided: boolean = !finishedTask || !finishedTask.formFields;

    if (noResultsProvided) {
      return {};
    }

    const formFieldResultIsNotAnObject: boolean = typeof finishedTask !== 'object'
      || typeof finishedTask.formFields !== 'object'
      || Array.isArray(finishedTask.formFields);

    if (formFieldResultIsNotAnObject) {
      throw new EssentialProjectErrors.BadRequestError(`The UserTask's FormFields are not an object.`);
    }

    return finishedTask.formFields;
  }

  private _publishFinishUserTaskEvent(
    identity: IIdentity,
    userTaskInstance: DataModels.UserTasks.UserTask,
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
