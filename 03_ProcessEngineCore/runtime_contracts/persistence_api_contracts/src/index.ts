/* eslint-disable @typescript-eslint/no-unused-vars */
import * as Repositorycontracts from './repositories/index';
import * as ServiceContracts from './services/index';
import * as UseCaseContracts from './use_cases/index';

import * as DataTypes from './types/index';

export namespace Repositories {
  export import ICorrelationRepository = Repositorycontracts.ICorrelationRepository;
  export import IExternalTaskRepository = Repositorycontracts.IExternalTaskRepository;
  export import IFlowNodeInstanceRepository = Repositorycontracts.IFlowNodeInstanceRepository;
  export import IProcessDefinitionRepository = Repositorycontracts.IProcessDefinitionRepository;
}

export namespace Services {
  export import ICorrelationService = ServiceContracts.ICorrelationService;
  export import IExternalTaskService = ServiceContracts.IExternalTaskService;
  export import IFlowNodeInstanceService = ServiceContracts.IFlowNodeInstanceService;
  export import IProcessDefinitionService = ServiceContracts.IProcessDefinitionService;
}

export namespace Types {
  export import BpmnTags = DataTypes.BpmnTags;
  export import BpmnType = DataTypes.BpmnType;
  export import Correlation = DataTypes.Correlations;
  export import EventType = DataTypes.EventType;
  export import ExternalTask = DataTypes.ExternalTasks;
  export import FlowNodeInstance = DataTypes.FlowNodeInstances;
  export import IModelParser = DataTypes.IModelParser;
  export import ProcessDefinitionFromRepository = DataTypes.ProcessDefinitionFromRepository;
  export import ProcessModel = DataTypes.ProcessModel;
}

export namespace UseCases {
  export import IProcessModelUseCases = UseCaseContracts.IProcessModelUseCases;
}
