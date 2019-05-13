/* eslint @typescript-eslint/no-explicit-any: "off" */
import {IIdentity} from '@essential-projects/iam_contracts';

import {DataModels} from '@process-engine/process_engine_api.contracts';
import {Correlation, ICorrelationService} from '@process-engine/correlation.contracts';
import {
  FlowNodeInstance, IFlowNodeInstanceService, ProcessToken, ProcessTokenType,
} from '@process-engine/flow_node_instance.contracts';
import {
  IFlowNodeInstanceResult,
  IProcessModelFacade,
  IProcessModelFacadeFactory,
  IProcessTokenFacade,
  IProcessTokenFacadeFactory,
} from '@process-engine/process_engine_contracts';
import {BpmnType, IProcessModelUseCases, Model} from '@process-engine/process_model.contracts';

import * as ProcessModelCache from './process_model_cache';

export class UserTaskConverter {

  private readonly correlationService: ICorrelationService;
  private readonly flowNodeInstanceService: IFlowNodeInstanceService;
  private readonly processModelFacadeFactory: IProcessModelFacadeFactory;
  private readonly processModelUseCase: IProcessModelUseCases;
  private readonly processTokenFacadeFactory: IProcessTokenFacadeFactory;

  constructor(
    correlationRepository: ICorrelationService,
    flowNodeInstanceService: IFlowNodeInstanceService,
    processModelFacadeFactory: IProcessModelFacadeFactory,
    processModelUse: IProcessModelUseCases,
    processTokenFacadeFactory: IProcessTokenFacadeFactory,
  ) {
    this.correlationService = correlationRepository;
    this.processModelUseCase = processModelUse;
    this.flowNodeInstanceService = flowNodeInstanceService;
    this.processModelFacadeFactory = processModelFacadeFactory;
    this.processTokenFacadeFactory = processTokenFacadeFactory;
  }

  public async convertUserTasks<TTokenPayload>(
    identity: IIdentity,
    suspendedFlowNodes: Array<FlowNodeInstance>,
  ): Promise<Array<DataModels.UserTasks.UserTask<TTokenPayload>>> {

    const suspendedUserTasks: Array<DataModels.UserTasks.UserTask<TTokenPayload>> = [];

    for (const suspendedFlowNode of suspendedFlowNodes) {

      // Note that UserTasks are not the only types of FlowNodes that can be suspended.
      // So we must make sure that what we have here is actually a UserTask and not, for example, a TimerEvent.
      const flowNodeIsNotAUserTask: boolean = suspendedFlowNode.flowNodeType !== BpmnType.userTask;
      if (flowNodeIsNotAUserTask) {
        continue;
      }

      const processModelFacade: IProcessModelFacade = await this.getProcessModelForFlowNodeInstance(identity, suspendedFlowNode);

      const flowNodeModel: Model.Base.FlowNode = processModelFacade.getFlowNodeById(suspendedFlowNode.flowNodeId);

      const userTask: DataModels.UserTasks.UserTask<TTokenPayload> =
        await this.convertToPublicApiUserTask(flowNodeModel as Model.Activities.UserTask, suspendedFlowNode);

      suspendedUserTasks.push(userTask);
    }

    return suspendedUserTasks;
  }

  private async getProcessModelForFlowNodeInstance(
    identity: IIdentity,
    flowNodeInstance: FlowNodeInstance,
  ): Promise<IProcessModelFacade> {

    let processModel: Model.Process;

    // We must store the ProcessModel for each user, to account for lane-restrictions.
    // Some users may not be able to see some lanes that are visible to others.
    const cacheKeyToUse: string = `${flowNodeInstance.processInstanceId}-${identity.userId}`;

    const cacheHasMatchingEntry: boolean = ProcessModelCache.hasEntry(cacheKeyToUse);
    if (cacheHasMatchingEntry) {
      processModel = ProcessModelCache.get(cacheKeyToUse);
    } else {
      const processModelHash: string = await this.getProcessModelHashForProcessInstance(identity, flowNodeInstance.processInstanceId);
      processModel = await this.processModelUseCase.getByHash(identity, flowNodeInstance.processModelId, processModelHash);
      ProcessModelCache.add(cacheKeyToUse, processModel);
    }

    const processModelFacade: IProcessModelFacade = this.processModelFacadeFactory.create(processModel);

    return processModelFacade;
  }

  private async getProcessModelHashForProcessInstance(identity: IIdentity, processInstanceId: string): Promise<string> {
    const correlationForProcessInstance: Correlation = await this.correlationService.getByProcessInstanceId(identity, processInstanceId);

    // Note that ProcessInstances will only ever have one processModel and therefore only one hash attached to them.
    return correlationForProcessInstance.processInstances[0].hash;
  }

  private async convertToPublicApiUserTask<TTokenPayload>(
    userTaskModel: Model.Activities.UserTask,
    userTaskInstance: FlowNodeInstance,
  ): Promise<DataModels.UserTasks.UserTask<TTokenPayload>> {

    const currentUserTaskToken: ProcessToken = userTaskInstance.getTokenByType(ProcessTokenType.onSuspend);

    const userTaskTokenOldFormat: any = await this.getUserTaskTokenInOldFormat(currentUserTaskToken);

    const userTaskFormFields: Array<DataModels.UserTasks.UserTaskFormField> =
      userTaskModel.formFields.map((formField: Model.Activities.Types.UserTaskFormField): DataModels.UserTasks.UserTaskFormField => {
        return this.convertToPublicApiFormField(formField, userTaskTokenOldFormat);
      });

    const userTaskConfig: DataModels.UserTasks.UserTaskConfig = {
      formFields: userTaskFormFields,
      preferredControl: this.evaluateExpressionWithOldToken(userTaskModel.preferredControl, userTaskTokenOldFormat),
      description: userTaskModel.description,
      finishedMessage: userTaskModel.finishedMessage,
    };

    const sanitizedApiUserTask: DataModels.UserTasks.UserTask<TTokenPayload> = {
      id: userTaskInstance.flowNodeId,
      flowNodeInstanceId: userTaskInstance.id,
      name: userTaskModel.name,
      correlationId: userTaskInstance.correlationId,
      processModelId: userTaskInstance.processModelId,
      processInstanceId: userTaskInstance.processInstanceId,
      data: userTaskConfig,
      tokenPayload: currentUserTaskToken.payload,
    };

    return sanitizedApiUserTask;
  }

  private convertToPublicApiFormField(
    formField: Model.Activities.Types.UserTaskFormField,
    oldTokenFormat: any,
  ): DataModels.UserTasks.UserTaskFormField {

    const userTaskFormField: DataModels.UserTasks.UserTaskFormField = new DataModels.UserTasks.UserTaskFormField();
    userTaskFormField.id = formField.id;
    userTaskFormField.label = this.evaluateExpressionWithOldToken(formField.label, oldTokenFormat);
    userTaskFormField.type = DataModels.UserTasks.UserTaskFormFieldType[formField.type];
    userTaskFormField.enumValues = formField.enumValues;
    userTaskFormField.defaultValue = this.evaluateExpressionWithOldToken(formField.defaultValue, oldTokenFormat);
    userTaskFormField.preferredControl = this.evaluateExpressionWithOldToken(formField.preferredControl, oldTokenFormat);

    return userTaskFormField;
  }

  private evaluateExpressionWithOldToken(expression: string, oldTokenFormat: any): string | null {

    let result: string = expression;

    if (!expression) {
      return result;
    }

    const expressionStartsOn = '${';
    const expressionEndsOn = '}';

    const isExpression: boolean = expression.charAt(0) === '$';
    if (isExpression === false) {
      return result;
    }

    const finalExpressionLength: number = expression.length - expressionStartsOn.length - expressionEndsOn.length;
    const expressionBody: string = expression.substr(expressionStartsOn.length, finalExpressionLength);

    const functionString: string = `return ${expressionBody}`;
    const scriptFunction: Function = new Function('token', functionString);

    result = scriptFunction.call(undefined, oldTokenFormat);
    result = result === undefined ? '' : result;

    return result;
  }

  private async getUserTaskTokenInOldFormat(currentProcessToken: ProcessToken): Promise<any> {

    const {
      processInstanceId, processModelId, correlationId, identity,
    } = currentProcessToken;

    const processInstanceTokens: Array<ProcessToken> = await this.flowNodeInstanceService.queryProcessTokensByProcessInstanceId(processInstanceId);

    const filteredInstanceTokens: Array<ProcessToken> = processInstanceTokens.filter((token: ProcessToken): boolean => {
      return token.type === ProcessTokenType.onExit;
    });

    const processTokenFacade: IProcessTokenFacade = this.processTokenFacadeFactory.create(processInstanceId, processModelId, correlationId, identity);

    const processTokenResultPromises: Array<Promise<IFlowNodeInstanceResult>> =
      filteredInstanceTokens.map(async (processToken: ProcessToken): Promise<IFlowNodeInstanceResult> => {
        const processTokenFlowNodeInstance: FlowNodeInstance = await this.flowNodeInstanceService.queryByInstanceId(processToken.flowNodeInstanceId);

        return {
          flowNodeInstanceId: processTokenFlowNodeInstance.id,
          flowNodeId: processTokenFlowNodeInstance.flowNodeId,
          result: processToken.payload,
        };
      });

    const processTokenResults: Array<IFlowNodeInstanceResult> = await Promise.all(processTokenResultPromises);

    processTokenFacade.importResults(processTokenResults);

    return processTokenFacade.getOldTokenFormat();
  }

}
