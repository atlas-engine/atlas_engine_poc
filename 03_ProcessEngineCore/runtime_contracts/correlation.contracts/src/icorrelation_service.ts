import {IIdentity} from '@essential-projects/iam_contracts';

import {Correlation} from './types/index';

/**
 * The Service for accessing the CorrelationRepository.
 *
 * Correlations combine a Correlation ID with a ProcessModel Hash.
 * This allows for implementing versioning of ProcessModels, as well
 * as keeping track on how a ProcessModel looked at the time a certain
 * Correlation was run.
 *
 * Note that a ProcessModel instance will only belong to one Correlation,
 * but a Correlation can have multiple ProcessModel instances.
 */
export interface ICorrelationService {

  /**
   * Stores a new Correlation in the database.
   *
   * @async
   * @param identity                The executing users identity.
   * @param correlationId           The ID of the Correlation to store.
   * @param processInstanceId       The ID of the ProcessInstance to associate
   *                                with the Correlation.
   * @param processModelId          The ID of the ProcessModel to associate
   *                                with the Correlation.
   * @param processModelHash        The Hash of the ProcessModel to associate
   *                                with the Correlation.
   * @param parentProcessInstanceId Optional: If the ProcessInstance is a
   *                                Subprocess, this contains the ID of the
   *                                ProcessInstance that started it.
   */
  createEntry(identity: IIdentity,
    correlationId: string,
    processInstanceId: string,
    processModelId: string,
    processModelHash: string,
    parentProcessInstanceId?: string): Promise<void>;

  /**
   * Returns a list of all Correlations.
   *
   * @async
   * @param identity The executing users identity.
   * @returns        A list of Correlations.
   */
  getAll(identity: IIdentity): Promise<Array<Correlation>>;

  /**
   * Returns a list of all Correlations that contain at least one active
   * ProcessInstance.
   *
   * @async
   * @param identity The executing users identity.
   * @returns        A list of Correlations.
   */
  getActive(identity: IIdentity): Promise<Array<Correlation>>;

  /**
   * Gets a specific Correlation by its ID.
   *
   * @async
   * @param identity        The executing users identity.
   * @param correlationId   The ID of the Correlation to retrieve.
   * @returns               The retrieved Correlation.
   * @throws                404, If the Correlation was not found.
   */
  getByCorrelationId(identity: IIdentity, correlationId: string): Promise<Correlation>;

  /**
   * Gets all entries with a specific ProcessModelId.
   *
   * @async
   * @param identity        The executing users identity.
   * @param processModelId  The ID of the ProcessModel for which to retrieve
   *                        the Correlations.
   * @returns               The retrieved Correlations.
   */
  getByProcessModelId(identity: IIdentity, processModelId: string): Promise<Array<Correlation>>;

  /**
   * Gets the entry that belongs to the given ProcessInstanceId.
   * Note that ProcessInstanceIds are always unique, so this will always
   * return only one entry.
   *
   * @async
   * @param identity          The executing users identity.
   * @param processInstanceId The ID of the ProcessInstance for which to retrieve
   *                          the Correlations.
   * @returns                 The retrieved Correlation.
   * @throws                  404, If the Correlation was not found.
   */
  getByProcessInstanceId(identity: IIdentity, processInstanceId: string): Promise<Correlation>;

  /**
   * Gets a Correlation-Object that contains all Subprocesses for the given
   * ProcessInstanceId.
   *
   * @async
   * @param identity          The executing users identity.
   * @param processInstanceId The ID of the ProcessInstance for which to retrieve
   *                          the SubProcess-Correlations.
   * @returns                 The retrieved Correlations.
   *                          If none are found, an empty Array is returned.
   */
  getSubprocessesForProcessInstance(identity: IIdentity, processInstanceId: string): Promise<Correlation>;

  /**
   * Removes all Correlations with a specific ProcessModelId.
   *
   * @async
   * @param identity        The executing users identity.
   * @param processModelId  The ID of the processModel, by which Correlations should be removed.
   */
  deleteCorrelationByProcessModelId(identity: IIdentity, processModelId: string): Promise<void>;

  /**
   * Finishes the given ProcessInstance in the given Correlation.
   *
   * @async
   * @param  identity          The executing users identity.
   * @param  correlationId     The ID of the Correlation to finish.
   * @param  processInstanceId The ID of the ProcessInstance to finish.
   * @throws {NotFoundError}   When no matching correlation was found.
   * @throws {ForbiddenError}  When the user doesn't have access to the
   *                           correlation.
   */
  finishProcessInstanceInCorrelation(identity: IIdentity, correlationId: string, processInstanceId: string): Promise<void>;

  /**
   * Finishes the given ProcessInstance in the given Correlation with an error.
   *
   * @async
   * @param  identity          The executing users identity.
   * @param  correlationId     The ID of the Correlation to finish erroneously.
   * @param  processInstanceId The ID of the ProcessInstance to finish.
   * @param  error             The error that occurred.
   * @throws {NotFoundError}   When no matching correlation was found.
   * @throws {ForbiddenError}  When the user doesn't have access to the
   *                           correlation.
   */
  finishProcessInstanceInCorrelationWithError(identity: IIdentity, correlationId: string, processInstanceId: string, error: Error): Promise<void>;
}
