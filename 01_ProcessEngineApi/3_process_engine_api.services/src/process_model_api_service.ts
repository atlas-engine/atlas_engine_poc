import * as EssentialProjectErrors from '@essential-projects/errors_ts';
import {IIdentity} from '@essential-projects/iam_contracts';
import {APIs, DataModels, Repositories} from '@process-engine/process_engine_api.contracts';
import {Model} from '@process-engine/process_model.contracts';

import {ProcessModelConverter} from './converters/index';

export class ProcessModelApiService implements APIs.IProcessModelApi {

  private readonly processModelConverter: ProcessModelConverter;
  private readonly processModelRepository: Repositories.IProcessModelRepository;

  constructor(
    processModelConverter: ProcessModelConverter,
    processModelRepository: Repositories.IProcessModelRepository,
  ) {
    this.processModelConverter = processModelConverter;
    this.processModelRepository = processModelRepository;
  }

  public async getProcessModels(identity: IIdentity): Promise<Array<DataModels.ProcessModels.ProcessModel>> {

    const processModels = await this.processModelRepository.getProcessModels(identity);
    const sanitizedProcessModels =
      processModels.map((processModel: Model.Process): DataModels.ProcessModels.ProcessModel => {
        return this.processModelConverter.convertProcessModel(processModel);
      });

    return sanitizedProcessModels;
  }

  public async getProcessModelById(identity: IIdentity, processModelId: string): Promise<DataModels.ProcessModels.ProcessModel> {

    const processModel = await this.processModelRepository.getProcessModelById(identity, processModelId);
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

    const response: DataModels.ProcessModels.ProcessStartResponsePayload =
      await this.startProcessInstanceAndReturnResult<TInputValues>(
        identity,
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
    processModelId: string,
    startEventId: string,
    payload: DataModels.ProcessModels.ProcessStartRequestPayload<TInputValues>,
    startCallbackType: DataModels.ProcessModels.StartCallbackType,
    endEventId?: string,
  ): Promise<DataModels.ProcessModels.ProcessStartResponsePayload> {

    // Only start the process instance and return
    const resolveImmediatelyAfterStart = startCallbackType === DataModels.ProcessModels.StartCallbackType.CallbackOnProcessInstanceCreated;
    if (resolveImmediatelyAfterStart) {
      return this.processModelRepository.startProcessInstance(identity, processModelId, payload, startEventId);
    }

    // Start the process instance and wait for a specific end event result
    const resolveAfterReachingSpecificEndEvent = startCallbackType === DataModels.ProcessModels.StartCallbackType.CallbackOnEndEventReached;
    if (resolveAfterReachingSpecificEndEvent) {
      return this.processModelRepository.startAndAwaitSpecificEndEvent(identity, processModelId, payload, startEventId, endEventId);
    }

    return this.processModelRepository.startAndAwaitEndEvent(identity, processModelId, payload, startEventId);
  }

}
