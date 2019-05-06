import {APIs} from './apis/index';

/**
 * The primary access point for the ProcessEngineAdminApi.
 * This service contains all functions that the ProcessEngineAdminApi employs to
 * communicate with the ProcessEngine to perform administrative functions.
 */
export interface IProcessEngineAdminApi extends APIs.IDeploymentApi, APIs.IKpiApi {}
