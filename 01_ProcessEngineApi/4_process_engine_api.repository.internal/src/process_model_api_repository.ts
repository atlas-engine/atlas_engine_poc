import * as uuid from 'node-uuid';

import * as EssentialProjectErrors from '@essential-projects/errors_ts';
import {IIdentity} from '@essential-projects/iam_contracts';
import {APIs, DataModels} from '@process-engine/process_engine_api.contracts';
import {IProcessModelUseCases, Model} from '@process-engine/process_model.contracts';
import {
  EndEventReachedMessage,
  IExecuteProcessService,
} from '@process-engine/process_engine_contracts';

import {ProcessModelConverter} from './converters/index';

export class ProcessModelApiRepository implements APIs.IProcessModelApi {

  private readonly executeProcessService: IExecuteProcessService;
  private readonly processModelUseCase: IProcessModelUseCases;
  private readonly processModelConverter: ProcessModelConverter;

  constructor(
    executeProcessService: IExecuteProcessService,
    processModelUseCase: IProcessModelUseCases,
    processModelConverter: ProcessModelConverter,
  ) {
    this.executeProcessService = executeProcessService;
    this.processModelUseCase = processModelUseCase;
    this.processModelConverter = processModelConverter;
  }

  public async getProcessModels(identity: IIdentity): Promise<Array<DataModels.ProcessModels.ProcessModel>> {

    const processModels = await this.processModelUseCase.getProcessModels(identity);
    const sanitizedProcessModels =
      processModels.map((processModel: Model.Process): DataModels.ProcessModels.ProcessModel => {
        return this.processModelConverter.convertProcessModel(processModel);
      });

    return sanitizedProcessModels;
  }

  public async getProcessModelById(identity: IIdentity, processModelId: string): Promise<DataModels.ProcessModels.ProcessModel> {

    const processModel = await this.processModelUseCase.getProcessModelById(identity, processModelId);
    const sanitizedProcessModel = this.processModelConverter.convertProcessModel(processModel);

    return sanitizedProcessModel;
  }

  public async startProcessInstance<TInputValues>(
    identity: IIdentity,
    processModelId: string,
    payload: DataModels.ProcessModels.ProcessStartRequestPayload<TInputValues>,
    startCallbackType?: DataModels.ProcessModels.StartCallbackType,
    startEventId?: string,
    endEventId?: string,
  ): Promise<DataModels.ProcessModels.ProcessStartResponsePayload> {

    const startCallbackTypeToUse = startCallbackType === undefined
      ? DataModels.ProcessModels.StartCallbackType.CallbackOnProcessInstanceCreated
      : startCallbackType;

    const startCallbackTypeIsInvalid = !Object.values(DataModels.ProcessModels.StartCallbackType).includes(startCallbackTypeToUse);
    if (startCallbackTypeIsInvalid) {
      throw new EssentialProjectErrors.BadRequestError(`${startCallbackTypeToUse} is not a valid return option!`);
    }

    const correlationId = payload.correlationId || uuid.v4();

    const response: DataModels.ProcessModels.ProcessStartResponsePayload =
      await this.startProcessInstanceAndReturnResult<TInputValues>(
        identity,
        correlationId,
        processModelId,
        startEventId,
        payload,
        startCallbackTypeToUse,
        endEventId,
      );

    return response;
  }

  private async startProcessInstanceAndReturnResult<TInputValues>(
    identity: IIdentity,
    correlationId: string,
    processModelId: string,
    startEventId: string,
    payload: DataModels.ProcessModels.ProcessStartRequestPayload<TInputValues>,
    startCallbackType: DataModels.ProcessModels.StartCallbackType,
    endEventId?: string,
  ): Promise<DataModels.ProcessModels.ProcessStartResponsePayload> {

    const response: DataModels.ProcessModels.ProcessStartResponsePayload = {
      correlationId: correlationId,
      processInstanceId: undefined,
    };

    // Only start the process instance and return
    const resolveImmediatelyAfterStart = startCallbackType === DataModels.ProcessModels.StartCallbackType.CallbackOnProcessInstanceCreated;
    if (resolveImmediatelyAfterStart) {
      const startResult =
        await this.executeProcessService.start(identity, processModelId, correlationId, startEventId, payload.inputValues, payload.callerId);

      response.processInstanceId = startResult.processInstanceId;

      return response;
    }

    let processEndedMessage: EndEventReachedMessage;

    // Start the process instance and wait for a specific end event result
    const resolveAfterReachingSpecificEndEvent = startCallbackType === DataModels.ProcessModels.StartCallbackType.CallbackOnEndEventReached;
    if (resolveAfterReachingSpecificEndEvent) {

      processEndedMessage = await this
        .executeProcessService
        .startAndAwaitSpecificEndEvent(identity, processModelId, correlationId, endEventId, startEventId, payload.inputValues, payload.callerId);

      response.endEventId = processEndedMessage.flowNodeId;
      response.tokenPayload = processEndedMessage.currentToken;
      response.processInstanceId = processEndedMessage.processInstanceId;

      return response;
    }

    // Start the process instance and wait for the first end event result
    processEndedMessage = await this
      .executeProcessService
      .startAndAwaitEndEvent(identity, processModelId, correlationId, startEventId, payload.inputValues, payload.callerId);

    response.endEventId = processEndedMessage.flowNodeId;
    response.tokenPayload = processEndedMessage.currentToken;
    response.processInstanceId = processEndedMessage.processInstanceId;

    return response;
  }

}
