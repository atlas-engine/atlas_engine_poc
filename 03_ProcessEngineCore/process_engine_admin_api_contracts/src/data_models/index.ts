import * as deployment from './deployment/index';
import * as kpi from './kpi/index';

// tslint:disable-next-line:no-namespace
export namespace DataModels {
  export import Deployment = deployment;
  export import Kpi = kpi;
}
