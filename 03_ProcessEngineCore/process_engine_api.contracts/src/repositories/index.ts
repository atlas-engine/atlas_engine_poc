/* eslint-disable @typescript-eslint/no-unused-vars */
import * as processModelRepository from './iprocess_model_repository';
import * as userTaskRepository from './iuser_task_repository';

export namespace Repositories {
  export import IProcessModelRepository = processModelRepository.IProcessModelRepository;
  export import IUserTaskRepository = userTaskRepository.IUserTaskRepository;
}
