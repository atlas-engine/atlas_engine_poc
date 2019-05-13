import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {APIs, DataModels} from '@process-engine/process_engine_api.contracts';

import {Response} from 'express';

export class ProcessEngineApiController {

  private httpCodeSuccessfulResponse: number = 200;
  private httpCodeSuccessfulNoContentResponse: number = 204;

  private processModelApiService: APIs.IProcessModelApi;
  private userTaskApiService: APIs.IUserTaskApi;

  constructor(processModelApiService: APIs.IProcessModelApi, userTaskApiService: APIs.IUserTaskApi) {
    this.processModelApiService = processModelApiService;
    this.userTaskApiService = userTaskApiService;
  }

  public async getProcessModels(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;

    const result: Array<DataModels.ProcessModels.ProcessModel> = await this.processModelApiService.getProcessModels(identity);

    response
      .status(this.httpCodeSuccessfulResponse)
      .json(result);
  }

  public async getProcessModelById(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processModelId: string = request.params.process_model_id;
    const identity: IIdentity = request.identity;

    const result: DataModels.ProcessModels.ProcessModel = await this.processModelApiService.getProcessModelById(identity, processModelId);

    response
      .status(this.httpCodeSuccessfulResponse)
      .json(result);
  }

  public async startProcessInstance(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processModelId: string = request.params.process_model_id;
    const startEventId: string = request.query.start_event_id;
    const endEventId: string = request.query.end_event_id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: DataModels.ProcessModels.ProcessStartRequestPayload<any> = request.body;
    let startCallbackType: DataModels.ProcessModels.StartCallbackType =
      <DataModels.ProcessModels.StartCallbackType> Number.parseInt(request.query.start_callback_type);

    if (!startCallbackType) {
      startCallbackType = DataModels.ProcessModels.StartCallbackType.CallbackOnProcessInstanceCreated;
    }

    const identity: IIdentity = request.identity;

    const result: DataModels.ProcessModels.ProcessStartResponsePayload =
      await this.processModelApiService.startProcessInstance(identity, processModelId, payload, startCallbackType, startEventId, endEventId);

    response
      .status(this.httpCodeSuccessfulResponse)
      .json(result);
  }

  // user-task-routes
  public async getUserTasksForCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const correlationId: string = request.params.correlation_id;
    const identity: IIdentity = request.identity;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: Array<DataModels.UserTasks.UserTask<any>> = await this.userTaskApiService.getUserTasksForCorrelation(identity, correlationId);

    response
      .status(this.httpCodeSuccessfulResponse)
      .json(result);
  }

  public async finishUserTask(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;
    const processInstanceId: string = request.params.process_instance_id;
    const correlationId: string = request.params.correlation_id;
    const userTaskInstanceId: string = request.params.user_task_instance_id;
    const userTaskResult: DataModels.UserTasks.UserTaskResult = request.body;

    await this.userTaskApiService.finishUserTask(identity, processInstanceId, correlationId, userTaskInstanceId, userTaskResult);

    response
      .status(this.httpCodeSuccessfulNoContentResponse)
      .send();
  }

}
