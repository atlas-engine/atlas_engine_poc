import {IIdentity} from '@essential-projects/iam_contracts';
import {ImportProcessDefinitionsRequestPayload} from '../data_models/deployment/index';

/**
 * Defines the contracts for the Deployment Repository, which can be used to
 * deploy ProcessDefinitions to a ProcessEngine.
 */
export interface IDeploymentRepository {

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
  deploy(identity: IIdentity, payload: ImportProcessDefinitionsRequestPayload): Promise<void>;

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
