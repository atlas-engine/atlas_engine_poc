import {IIdentity} from '@essential-projects/iam_contracts';

import {Model} from '@process-engine/process_model.contracts';

import {DataModels} from '../data_models';

/**
 * The IProcessModelConsumerApi is used to retreive ProcessModels and start ProcessInstances.
 */
export interface IProcessModelRepository {
  /**
   * Retrieves a list of all ProcessModels that the requesting user is
   * authorized to see.
   *
   * @async
   * @param   identity           The requesting users identity.
   * @returns                    A list of accessible ProcessModels.
   *                             Will be empty, if none are available.
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   */
  getProcessModels(identity: IIdentity): Promise<Array<Model.Process>>;

  /**
   * Retrieves a ProcessModel by its ID.
   *
   * @async
   * @param   identity           The requesting users identity.
   * @param   processModelId     The ID of the ProcessModel to retrieve.
   * @returns                    The retrieved ProcessModel.
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   * @throws {ForbiddenError}    If the user is not allowed to access the
   *                             ProcessModel.
   * @throws {NotFoundError}     If ProcessModel was not found.
   */
  getProcessModelById(identity: IIdentity, processModelId: string): Promise<Model.Process>;

  /**
   * Starts a new instance of a ProcessModel with a specific ID.
   * This function resolves immediately after the ProcessIntance was started.
   *
   * @async
   * @param   identity           The requesting users identity.
   * @param   processModelId     The ID of the ProcessModel to retrieve.
   * @param   payload            Contains parameters to pass to the ProcessInstance.
   *                             Can optionally define a CorrelationId to use.
   * @param   startEventId       The ID of the StartEvent through which to
   *                             start the ProcessInstance.
   * @returns                    The final result of the request.
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   * @throws {ForbiddenError}    If the user is not allowed to access the
   *                             ProcessModel.
   * @throws {NotFoundError}     If ProcessModel was not found.
   */
  startProcessInstance<TInputValues>(
    identity: IIdentity,
    processModelId: string,
    payload: DataModels.ProcessModels.ProcessStartRequestPayload<TInputValues>,
    startEventId?: string,
  ): Promise<DataModels.ProcessModels.ProcessStartResponsePayload>;

  /**
   * Starts a new instance of a ProcessModel with a specific ID.
   * Resolves after the ProcessInstance reached its first EndEvent.
   *
   * @async
   * @param   identity           The requesting users identity.
   * @param   processModelId     The ID of the ProcessModel to retrieve.
   * @param   payload            Contains parameters to pass to the ProcessInstance.
   *                             Can optionally define a CorrelationId to use.
   * @param   startEventId       The ID of the StartEvent through which to
   *                             start the ProcessInstance.
   * @returns                    The final result of the request.
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   * @throws {ForbiddenError}    If the user is not allowed to access the
   *                             ProcessModel.
   * @throws {NotFoundError}     If ProcessModel was not found.
   */
  startAndAwaitEndEvent<TInputValues>(
    identity: IIdentity,
    processModelId: string,
    payload: DataModels.ProcessModels.ProcessStartRequestPayload<TInputValues>,
    startEventId?: string,
  ): Promise<DataModels.ProcessModels.ProcessStartResponsePayload>;

  /**
   * Starts a new instance of a ProcessModel with a specific ID.
   * Resolves after the ProcessInstance reached an EndEvent with a given ID.
   *
   * @async
   * @param   identity           The requesting users identity.
   * @param   processModelId     The ID of the ProcessModel to retrieve.
   * @param   payload            Contains parameters to pass to the ProcessInstance.
   *                             Can optionally define a CorrelationId to use.
   * @param   startEventId       The ID of the StartEvent through which to
   *                             start the ProcessInstance.
   * @param   endEventId         The ID of the EndEvent that the ProcessEngine
   *                             should wait for, before resolving.
   *                             Works only in conjunction with the
   *                             startCallbackType "CallbackOnEndEventReached".
   * @returns                    The final result of the request.
   * @throws {UnauthorizedError} If the given identity does not contain a
   *                             valid auth token.
   * @throws {ForbiddenError}    If the user is not allowed to access the
   *                             ProcessModel.
   * @throws {NotFoundError}     If ProcessModel was not found.
   */
  startAndAwaitSpecificEndEvent<TInputValues>(
    identity: IIdentity,
    processModelId: string,
    payload: DataModels.ProcessModels.ProcessStartRequestPayload<TInputValues>,
    startEventId?: string,
    endEventId?: string,
  ): Promise<DataModels.ProcessModels.ProcessStartResponsePayload>;
}
