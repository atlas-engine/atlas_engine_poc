import {IIdentity} from '@essential-projects/iam_contracts';

import {DataModels, Repositories} from '@process-engine/process_engine_admin_api.contracts';

import {IProcessModelUseCases} from '@process-engine/process_model.contracts';

export class DeploymentRepository implements Repositories.IDeploymentRepository {

  private processModelUseCases: IProcessModelUseCases;

  constructor(processModelUseCases: IProcessModelUseCases) {
    this.processModelUseCases = processModelUseCases;
  }

  public async deploy(identity: IIdentity, payload: DataModels.Deployment.ImportProcessDefinitionsRequestPayload): Promise<void> {
    await this.processModelUseCases.persistProcessDefinitions(identity, payload.name, payload.xml, payload.overwriteExisting);
  }

  public async undeploy(identity: IIdentity, processModelId: string): Promise<void> {
    return this.processModelUseCases.deleteProcessModel(identity, processModelId);
  }

}
