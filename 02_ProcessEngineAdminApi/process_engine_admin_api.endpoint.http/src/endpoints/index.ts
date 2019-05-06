import * as DeploymentEndpoint from './deployment/index';
import * as KpiEndpoint from './kpi/index';

export namespace Endpoints {
  export import Deployment = DeploymentEndpoint;
  export import Kpi = KpiEndpoint;
}
