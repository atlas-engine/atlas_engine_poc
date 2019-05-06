import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {DataModels, IConsumerApi} from '@process-engine/consumer_api_contracts';

import {Response} from 'express';

export class ProcessEngineApiController {
  public config: any = undefined;

  private httpCodeSuccessfulResponse: number = 200;
  private httpCodeSuccessfulNoContentResponse: number = 204;

  private _processEngineApiService: IConsumerApi;

  constructor(processEngineApiService: IConsumerApi) {
    this._processEngineApiService = processEngineApiService;
  }

  public async getProcessModels(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;

    const result: DataModels.ProcessModels.ProcessModelList = await this._processEngineApiService.getProcessModels(identity);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getProcessModelById(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processModelId: string = request.params.process_model_id;
    const identity: IIdentity = request.identity;

    const result: DataModels.ProcessModels.ProcessModel = await this._processEngineApiService.getProcessModelById(identity, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async startProcessInstance(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processModelId: string = request.params.process_model_id;
    const startEventId: string = request.query.start_event_id;
    const endEventId: string = request.query.end_event_id;
    const payload: DataModels.ProcessModels.ProcessStartRequestPayload = request.body;
    let startCallbackType: DataModels.ProcessModels.StartCallbackType =
      <DataModels.ProcessModels.StartCallbackType> Number.parseInt(request.query.start_callback_type);

    if (!startCallbackType) {
      startCallbackType = DataModels.ProcessModels.StartCallbackType.CallbackOnProcessInstanceCreated;
    }

    const identity: IIdentity = request.identity;

    const result: DataModels.ProcessModels.ProcessStartResponsePayload =
      await this._processEngineApiService.startProcessInstance(identity, processModelId, payload, startCallbackType, startEventId, endEventId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  // user-task-routes

  public async getUserTasksForCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const correlationId: string = request.params.correlation_id;
    const identity: IIdentity = request.identity;

    const result: DataModels.UserTasks.UserTaskList = await this._processEngineApiService.getUserTasksForCorrelation(identity, correlationId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async finishUserTask(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;
    const processInstanceId: string = request.params.process_instance_id;
    const correlationId: string = request.params.correlation_id;
    const userTaskInstanceId: string = request.params.user_task_instance_id;
    const userTaskResult: DataModels.UserTasks.UserTaskResult = request.body;

    await this._processEngineApiService.finishUserTask(identity, processInstanceId, correlationId, userTaskInstanceId, userTaskResult);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }
}
