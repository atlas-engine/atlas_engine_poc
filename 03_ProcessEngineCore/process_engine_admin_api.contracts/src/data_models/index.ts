/* eslint-disable @typescript-eslint/no-unused-vars */
import * as deployment from './deployment/index';
import * as kpi from './kpi/index';
import * as metrics from './metrics/index';

export namespace DataModels {
  export import Deployment = deployment;
  export import Kpi = kpi;
  export import Metrics = metrics;
}
