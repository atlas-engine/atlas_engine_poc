/* eslint-disable @typescript-eslint/no-unused-vars */
import * as deployment from './ideployment_repository';
import * as kpi from './ikpi_repository';

export namespace Repositories {
  export import IDeploymentRepository = deployment.IDeploymentRepository;
  export import IKpiRepository = kpi.IKpiRepository;
}
