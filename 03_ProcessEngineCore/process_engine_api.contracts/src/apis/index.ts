import * as processModelApi from './iprocess_model_consumer_api';
import * as userTaskApi from './iuser_task_consumer_api';

export namespace APIs {
  export import IProcessModelApi = processModelApi.IProcessModelApi;
  export import IUserTaskApi = userTaskApi.IUserTaskApi;
}
