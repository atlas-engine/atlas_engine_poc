/* eslint-disable require-await */
import {IIdentity} from '@essential-projects/iam_contracts';
import {APIs, DataModels} from '@process-engine/process_engine_api.contracts';

export class ProcessModelApiService implements APIs.IProcessModelApi {

  private readonly processModelRepository: APIs.IProcessModelApi;

  constructor(processModelRepository: APIs.IProcessModelApi) {
    this.processModelRepository = processModelRepository;
  }

  public async getProcessModels(identity: IIdentity): Promise<Array<DataModels.ProcessModels.ProcessModel>> {

    return this.processModelRepository.getProcessModels(identity);
  }

  public async getProcessModelById(identity: IIdentity, processModelId: string): Promise<DataModels.ProcessModels.ProcessModel> {

    return this.processModelRepository.getProcessModelById(identity, processModelId);
  }

  public async startProcessInstance<TInputValues>(
    identity: IIdentity,
    processModelId: string,
    payload: DataModels.ProcessModels.ProcessStartRequestPayload<TInputValues>,
    startCallbackType?: DataModels.ProcessModels.StartCallbackType,
    startEventId?: string,
    endEventId?: string,
  ): Promise<DataModels.ProcessModels.ProcessStartResponsePayload> {

    return this.processModelRepository.startProcessInstance(identity, processModelId, payload, startCallbackType, startEventId, endEventId);
  }

}
