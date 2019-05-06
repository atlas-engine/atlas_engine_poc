import * as deploymentApi from './ideployment_api';
import * as kpiApi from './ikpi_api';

// tslint:disable-next-line:no-namespace
export namespace APIs {
  export import IDeploymentApi = deploymentApi.IDeploymentApi;
  export import IKpiApi = kpiApi.IKpiApi;
}
