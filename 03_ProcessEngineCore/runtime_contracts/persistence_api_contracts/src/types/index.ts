/* eslint-disable @typescript-eslint/no-unused-vars */
import * as CorrelationTypes from './correlation/index';
import * as ExternalTaskTypes from './external_task/index';
import * as FlowNodeInstanceTypes from './flow_node_instance/index';

export * from './constants';
export * from './process_model';

export namespace Correlations {
  export import Correlation = CorrelationTypes.Correlation;
  export import CorrelationFromRepository = CorrelationTypes.CorrelationFromRepository;
  export import CorrelationProcessInstance = CorrelationTypes.CorrelationProcessInstance;
  export import CorrelationState = CorrelationTypes.CorrelationState;
}

export namespace ExternalTasks {
  export import ExternalTask = ExternalTaskTypes.ExternalTask;
  export import ExternalTaskState = ExternalTaskTypes.ExternalTaskState;
}

export namespace FlowNodeInstances {
  export import FlowNodeInstance = FlowNodeInstanceTypes.FlowNodeInstance;
  export import FlowNodeInstanceState = FlowNodeInstanceTypes.FlowNodeInstanceState;
  export import ProcessToken = FlowNodeInstanceTypes.ProcessToken;
  export import ProcessTokenType = FlowNodeInstanceTypes.ProcessTokenType;
}
