import {IExternalTaskApi} from './iexternal_task_api';

/**
 * This interface wraps the accessor that the ExternalTaskApiClient will use
 * to connect to an internal or external ProcessEngine.
 * It is derived from IExternalTaskApi, because the accessor will have to
 * perform the same type of requests, regardless of which type of ProcessEngine
 * is used.
 */
export interface IExternalTaskApiAccessor extends IExternalTaskApi {}
