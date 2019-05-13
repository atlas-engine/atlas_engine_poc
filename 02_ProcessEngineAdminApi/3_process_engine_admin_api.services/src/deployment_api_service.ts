import * as fs from 'fs';
import * as path from 'path';

import {UnauthorizedError} from '@essential-projects/errors_ts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {APIs, DataModels, Repositories} from '@process-engine/process_engine_admin_api.contracts';

export class DeploymentApiService implements APIs.IDeploymentApi {

  private deploymentApiRepository: Repositories.IDeploymentRepository;

  constructor(deploymentApiRepository: Repositories.IDeploymentRepository) {
    this.deploymentApiRepository = deploymentApiRepository;
  }

  public async importBpmnFromFile(
    identity: IIdentity,
    filePath: string,
    name?: string,
    overwriteExisting: boolean = true,
  ): Promise<void> {

    this.ensureIsAuthorized(identity);

    if (!filePath) {
      throw new Error('file does not exist');
    }

    const parsedFileName: path.ParsedPath = path.parse(filePath);
    const xml: string = await this.getXmlFromFile(filePath);

    const importPayload: DataModels.Deployment.ImportProcessDefinitionsRequestPayload = {
      name: name || parsedFileName.name,
      xml: xml,
      overwriteExisting: overwriteExisting,
    };

    await this.importBpmnFromXml(identity, importPayload);
  }

  public async importBpmnFromXml(identity: IIdentity, payload: DataModels.Deployment.ImportProcessDefinitionsRequestPayload): Promise<void> {
    this.ensureIsAuthorized(identity);

    await this.deploymentApiRepository.deploy(identity, payload);
  }

  public async undeploy(identity: IIdentity, processModelId: string): Promise<void> {
    this.ensureIsAuthorized(identity);

    await this.deploymentApiRepository.undeploy(identity, processModelId);
  }

  private async getXmlFromFile(filePath: string): Promise<string> {
    return new Promise<string>((resolve: Function, reject: Function): void => {
      fs.readFile(filePath, 'utf8', (error: Error, xmlString: string): void => {
        if (error) {
          reject(error);
        } else {
          resolve(xmlString);
        }
      });
    });
  }

  private ensureIsAuthorized(identity: IIdentity): void {

    // Note: When using an external accessor, this check is performed by the ConsumerApiHttp module.
    // Since that component is bypassed by the internal accessor, we need to perform this check here.
    if (!identity || typeof identity.token !== 'string') {
      throw new UnauthorizedError('No auth token provided!');
    }
  }

}
