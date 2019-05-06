import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {DataModels, IManagementApi} from '@process-engine/management_api_contracts';

import {Response} from 'express';

export class KpiController {

  private httpCodeSuccessfulResponse: number = 200;

  private _kpiApiService: IManagementApi;

  constructor(kpiApiService: IManagementApi) {
    this._kpiApiService = kpiApiService;
  }

  public async getRuntimeInformationForProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;
    const processModelId: string = request.params.process_model_id;

    const result: Array<DataModels.Kpi.FlowNodeRuntimeInformation> =
      await this._kpiApiService.getRuntimeInformationForProcessModel(identity, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getRuntimeInformationForFlowNode(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;
    const processModelId: string = request.params.process_model_id;
    const flowNodeId: string = request.params.flow_node_id;

    const result: DataModels.Kpi.FlowNodeRuntimeInformation =
      await this._kpiApiService.getRuntimeInformationForFlowNode(identity, processModelId, flowNodeId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getActiveTokensForProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;
    const processModelId: string = request.params.process_model_id;

    const result: Array<DataModels.Kpi.ActiveToken> = await this._kpiApiService.getActiveTokensForProcessModel(identity, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getActiveTokensForProcessInstance(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;
    const processInstanceId: string = request.params.process_instance_id;

    const result: Array<DataModels.Kpi.ActiveToken> = await this._kpiApiService.getActiveTokensForProcessInstance(identity, processInstanceId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getActiveTokensForCorrelationAndProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;
    const correlationId: string = request.params.correlation_id;
    const processModelId: string = request.params.process_model_id;

    const result: Array<DataModels.Kpi.ActiveToken> = await this
      ._kpiApiService
      .getActiveTokensForCorrelationAndProcessModel(identity, correlationId, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getActiveTokensForFlowNode(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;
    const flowNodeId: string = request.params.flow_node_id;

    const result: Array<DataModels.Kpi.ActiveToken> = await this._kpiApiService.getActiveTokensForFlowNode(identity, flowNodeId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }
}
