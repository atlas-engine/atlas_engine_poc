import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {APIs, DataModels} from '@process-engine/process_engine_admin_api.contracts';

import {Response} from 'express';

export class DeploymentController {

  private httpCodeSuccessfulResponse: number = 200;

  private deploymentService: APIs.IDeploymentApi;

  constructor(deploymentApiService: APIs.IDeploymentApi) {
    this.deploymentService = deploymentApiService;
  }

  public async importProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;
    const payload: DataModels.Deployment.ImportProcessDefinitionsRequestPayload = request.body;

    await this.deploymentService.importBpmnFromXml(identity, payload);

    response.status(this.httpCodeSuccessfulResponse).send();
  }

  public async undeployProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;
    const processModelId: string = request.params.process_model_id;

    await this.deploymentService.undeploy(identity, processModelId);

    response.status(this.httpCodeSuccessfulResponse).send();
  }

}
