/* eslint-disable @typescript-eslint/no-unused-vars */
import * as events from './event/index';
import * as processModels from './process_model/index';
import * as userTasks from './user_task/index';

export namespace DataModels {
  export import Events = events;
  export import ProcessModels = processModels;
  export import UserTasks = userTasks;
}
