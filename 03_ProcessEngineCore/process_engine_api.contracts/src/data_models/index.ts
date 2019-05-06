import * as events from './event/index';
import * as processModels from './process_model/index';
import * as userTasks from './user_task/index';

// tslint:disable-next-line:no-namespace
export namespace DataModels {
  export import Events = events;
  export import ProcessModels = processModels;
  export import UserTasks = userTasks;
}
