import {Response} from 'express';

import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

/**
 * Contains functions for a HTTP Controller that can be used for accessing
 * the Consumer API.
 */
export interface IConsumerApiHttpController {
  /**
   * Retrieves a list of all ProcessModels that the requesting user is
   * authorized to see.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  getProcessModels(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Retrieves a ProcessModel by its ID.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  getProcessModelById(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Starts a new instance of a ProcessModel with a specific ID.
   * Depending on the type of callback used, this function will resolve either
   * immediately after the ProcessInstance was started, or after it has reached
   * an EndEvent.
   * This can either be a specific EndEvent, or the first EndEvent encountered
   * during execution.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  startProcessInstance(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Retrieves a list of all suspended UserTasks belonging to a specific
   * Correlation.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  getUserTasksForCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void>;

  /**
   * Finishes a UserTask belonging to an instance of a specific ProcessModel
   * within a Correlation.
   *
   * @async
   * @param request  The HttpRequest object containing all request infos.
   * @param response The HttpResponse object to use for sending a Http response.
   */
  finishUserTask(request: HttpRequestWithIdentity, response: Response): Promise<void>;
}
