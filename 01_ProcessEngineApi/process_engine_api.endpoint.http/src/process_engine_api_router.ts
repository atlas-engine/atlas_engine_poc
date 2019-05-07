import {wrap} from 'async-middleware';

import {BaseRouter} from '@essential-projects/http_node';
import {IIdentityService} from '@essential-projects/iam_contracts';

import {restSettings} from '@process-engine/process_engine_api.contracts';
import {ProcessEngineApiController} from './process_engine_api_controller';
import {MiddlewareFunction, createResolveIdentityMiddleware} from './middlewares/index';

export class ProcessEngineApiRouter extends BaseRouter {

  private processEngineApiController: ProcessEngineApiController;
  private identityService: IIdentityService;

  constructor(processEngineApiController: ProcessEngineApiController, identityService: IIdentityService) {
    super();
    this.processEngineApiController = processEngineApiController;
    this.identityService = identityService;
  }

  public get baseRoute(): string {
    return 'api/process-engine/v1';
  }

  public initializeRouter(): void {
    this.registerMiddlewares();
    this.registerProcessModelRoutes();
    this.registerUserTaskRoutes();
  }

  private registerMiddlewares(): void {
    const resolveIdentity: MiddlewareFunction = createResolveIdentityMiddleware(this.identityService);
    this.router.use(wrap(resolveIdentity));
  }

  private registerProcessModelRoutes(): void {
    const controller: ProcessEngineApiController = this.processEngineApiController;

    this.router.get(restSettings.paths.processModels, wrap(controller.getProcessModels.bind(controller)));
    this.router.get(restSettings.paths.processModelById, wrap(controller.getProcessModelById.bind(controller)));
    this.router.post(restSettings.paths.startProcessInstance, wrap(controller.startProcessInstance.bind(controller)));
  }

  private registerUserTaskRoutes(): void {
    const controller: ProcessEngineApiController = this.processEngineApiController;

    this.router.get(restSettings.paths.correlationUserTasks, wrap(controller.getUserTasksForCorrelation.bind(controller)));
    this.router.post(restSettings.paths.finishUserTask, wrap(controller.finishUserTask.bind(controller)));
  }

}
