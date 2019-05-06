import {BaseRouter} from '@essential-projects/http_node';
import {IIdentityService} from '@essential-projects/iam_contracts';

import {restSettings} from '@process-engine/consumer_api_contracts';
import {ProcessEngineApiController} from './process_engine_api_controller';
import {createResolveIdentityMiddleware, MiddlewareFunction} from './middlewares/index';

import {wrap} from 'async-middleware';

export class ProcessEngineApiRouter extends BaseRouter {

  private _processEngineApiRestController: ProcessEngineApiController;
  private _identityService: IIdentityService;

  constructor(processEngineApiRestController: ProcessEngineApiController, identityService: IIdentityService) {
    super();
    this._processEngineApiRestController = processEngineApiRestController;
    this._identityService = identityService;
  }

  public get baseRoute(): string {
    return 'api/process-engine/v1';
  }

  public async initializeRouter(): Promise<void> {
    this._registerMiddlewares();
    this._registerProcessModelRoutes();
    this._registerUserTaskRoutes();
  }

  private _registerMiddlewares(): void {
    const resolveIdentity: MiddlewareFunction = createResolveIdentityMiddleware(this._identityService);
    this.router.use(wrap(resolveIdentity));
  }

  private _registerProcessModelRoutes(): void {
    const controller: ProcessEngineApiController = this._processEngineApiRestController;

    this.router.get(restSettings.paths.processModels, wrap(controller.getProcessModels.bind(controller)));
    this.router.get(restSettings.paths.processModelById, wrap(controller.getProcessModelById.bind(controller)));
    this.router.post(restSettings.paths.startProcessInstance, wrap(controller.startProcessInstance.bind(controller)));
  }

  private _registerUserTaskRoutes(): void {
    const controller: ProcessEngineApiController = this._processEngineApiRestController;

    this.router.get(restSettings.paths.correlationUserTasks, wrap(controller.getUserTasksForCorrelation.bind(controller)));
    this.router.post(restSettings.paths.finishUserTask, wrap(controller.finishUserTask.bind(controller)));
  }
}
