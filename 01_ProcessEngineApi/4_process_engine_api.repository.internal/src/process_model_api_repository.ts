import * as uuid from 'node-uuid';

import {IIdentity} from '@essential-projects/iam_contracts';
import {DataModels, Repositories} from '@process-engine/process_engine_api.contracts';
import {IProcessModelUseCases, Model} from '@process-engine/process_model.contracts';
import {IExecuteProcessService} from '@process-engine/process_engine_contracts';

export class ProcessModelApiRepository implements Repositories.IProcessModelRepository {

  private readonly executeProcessService: IExecuteProcessService;
  private readonly processModelUseCase: IProcessModelUseCases;

  constructor(
    executeProcessService: IExecuteProcessService,
    processModelUseCase: IProcessModelUseCases,
  ) {
    this.executeProcessService = executeProcessService;
    this.processModelUseCase = processModelUseCase;
  }

  public async getProcessModels(identity: IIdentity): Promise<Array<Model.Process>> {
    return this.processModelUseCase.getProcessModels(identity);
  }

  public async getProcessModelById(identity: IIdentity, processModelId: string): Promise<Model.Process> {
    return this.processModelUseCase.getProcessModelById(identity, processModelId);
  }

  public async startProcessInstance<TInputValues>(
    identity: IIdentity,
    processModelId: string,
    payload: DataModels.ProcessModels.ProcessStartRequestPayload<TInputValues>,
    startEventId?: string,
  ): Promise<DataModels.ProcessModels.ProcessStartResponsePayload> {

    const correlationId = payload.correlationId || uuid.v4();

    const response: DataModels.ProcessModels.ProcessStartResponsePayload = {
      correlationId: correlationId,
      processInstanceId: undefined,
    };

    const startResult =
      await this.executeProcessService.start(identity, processModelId, correlationId, startEventId, payload.inputValues, payload.callerId);

    response.processInstanceId = startResult.processInstanceId;

    return response;
  }

  public async startAndAwaitEndEvent<TInputValues>(
    identity: IIdentity,
    processModelId: string,
    payload: DataModels.ProcessModels.ProcessStartRequestPayload<TInputValues>,
    startEventId?: string,
  ): Promise<DataModels.ProcessModels.ProcessStartResponsePayload> {

    const correlationId = payload.correlationId || uuid.v4();

    const response: DataModels.ProcessModels.ProcessStartResponsePayload = {
      correlationId: correlationId,
      processInstanceId: undefined,
    };

    const processEndedMessage = await this
      .executeProcessService
      .startAndAwaitEndEvent(identity, processModelId, correlationId, startEventId, payload.inputValues, payload.callerId);

    response.endEventId = processEndedMessage.flowNodeId;
    response.tokenPayload = processEndedMessage.currentToken;
    response.processInstanceId = processEndedMessage.processInstanceId;

    return response;
  }

  public async startAndAwaitSpecificEndEvent<TInputValues>(
    identity: IIdentity,
    processModelId: string,
    payload: DataModels.ProcessModels.ProcessStartRequestPayload<TInputValues>,
    startEventId?: string,
    endEventId?: string,
  ): Promise<DataModels.ProcessModels.ProcessStartResponsePayload> {

    const correlationId = payload.correlationId || uuid.v4();

    const response: DataModels.ProcessModels.ProcessStartResponsePayload = {
      correlationId: correlationId,
      processInstanceId: undefined,
    };

    const processEndedMessage = await this
      .executeProcessService
      .startAndAwaitSpecificEndEvent(identity, processModelId, correlationId, endEventId, startEventId, payload.inputValues, payload.callerId);

    response.endEventId = processEndedMessage.flowNodeId;
    response.tokenPayload = processEndedMessage.currentToken;
    response.processInstanceId = processEndedMessage.processInstanceId;

    return response;
  }

}
