/* eslint-disable @typescript-eslint/no-unused-vars */
import * as deploymentApi from './ideployment_api';
import * as kpiApi from './ikpi_api';

export namespace APIs {
  export import IDeploymentApi = deploymentApi.IDeploymentApi;
  export import IKpiApi = kpiApi.IKpiApi;
}
