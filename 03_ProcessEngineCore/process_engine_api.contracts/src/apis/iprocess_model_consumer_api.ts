import {IIdentity} from '@essential-projects/iam_contracts';

import {DataModels} from '../data_models/index';

/**
 * The IProcessModelConsumerApi is used to retreive ProcessModels and start ProcessInstances.
 */
export interface IProcessModelApi {
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
  getProcessModels(identity: IIdentity): Promise<Array<DataModels.ProcessModels.ProcessModel>>;

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
  getProcessModelById(identity: IIdentity, processModelId: string): Promise<DataModels.ProcessModels.ProcessModel>;

  /**
   * Starts a new instance of a ProcessModel with a specific ID.
   * Depending on the type of callback used, this function will resolve either
   * immediately after the ProcessInstance was started, or after it has reached
   * an EndEvent.
   * This can either be a specific EndEvent, or the first EndEvent encountered
   * during execution.
   *
   * @async
   * @param   identity           The requesting users identity.
   * @param   processModelId     The ID of the ProcessModel to retrieve.
   * @param   payload            Contains parameters to pass to the ProcessInstance.
   *                             Can optionally define a CorrelationId to use.
   * @param   startCallbackType  The type of start callback use. Depending on
   *                             the value used, the function will either resolve
   *                             right after starting the ProcessInstance,
   *                             or after reaching an EndEvent.
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
  startProcessInstance<TInputValues>(
    identity: IIdentity,
    processModelId: string,
    payload: DataModels.ProcessModels.ProcessStartRequestPayload<TInputValues>,
    startCallbackType: DataModels.ProcessModels.StartCallbackType,
    startEventId?: string,
    endEventId?: string,
  ): Promise<DataModels.ProcessModels.ProcessStartResponsePayload>;
}
