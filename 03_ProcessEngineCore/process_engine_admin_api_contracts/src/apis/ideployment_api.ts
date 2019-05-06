import {ImportProcessDefinitionsRequestPayload} from './data_model';

import {IIdentity} from '@essential-projects/iam_contracts';

/**
 * Manages the deployment of ProcessDefinitions.
 */
export interface IDeploymentApi {

  /**
   * Imports a ProcessDefinition from the given payload.
   *
   * @async
   * @param identity             The requesting users identity.
   * @param payload              The payload that contains all necessary data.
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   * @throws {ForbiddenError}    If the user is not allowed to deploy
   *                             ProcessDefinitions.
   * @throws {ConflictError}     If an attempt is made to overwrite an existing
   *                             ProcessDefintion and payload.overwriteExisting
   *                             is set to false.
   */
  importBpmnFromXml(identity: IIdentity, payload: ImportProcessDefinitionsRequestPayload): Promise<void>;

  /**
   * Imports a ProcessDefinition from a given file path.
   *
   * @async
   * @param identity             The requesting users identity.
   * @param filePath             The path to the file that contains the
   *                             ProcessDefinitions xml.
   * @param name                 Optional: The name under which to save the
   *                             ProcessDefinition.
   *                             If not provided, the name of the file will
   *                             be used instead.
   * @param overwriteExisting    Optional: If true, any ProcessDefinition with
   *                             the same name will be overwritten.
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   * @throws {ForbiddenError}    If the user is not allowed to deploy
   *                             ProcessDefinitions.
   * @throws {ConflictError}     If an attempt is made to overwrite an existing
   *                             ProcessDefintion and overwriteExisting
   *                             is set to false.
   */
  importBpmnFromFile(identity: IIdentity, filePath: string, name?: string, overwriteExisting?: boolean): Promise<void>;

  /**
   * Removes the ProcesssModel with the given ID and all references to it.
   *
   * @async
   * @param identity             The requesting users identity.
   * @param processModelId       The ID of the ProcessModel to undeploy.
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   * @throws {ForbiddenError}    If the user is not allowed to undeploy
   *                             ProcessModels.
   */
  undeploy(identity: IIdentity, processModelId: string): Promise<void>;
}
