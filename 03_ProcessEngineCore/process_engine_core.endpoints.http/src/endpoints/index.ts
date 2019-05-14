/* eslint-disable @typescript-eslint/no-unused-vars */
import * as CorrelationsEndpoint from './correlations/index';
import * as FlowNodeInstancesEndpoint from './flow_node_instances/index';
import * as MetricsEndpoint from './metrics/index';
import * as ProcessModelsEndpoint from './process_models/index';

export namespace Endpoints {
  export import Correlations = CorrelationsEndpoint;
  export import FlowNodeInstances = FlowNodeInstancesEndpoint;
  export import Metrics = MetricsEndpoint;
  export import ProcessModels = ProcessModelsEndpoint;
}
