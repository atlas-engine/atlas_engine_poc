import {BaseRouter} from '@essential-projects/http_node';
import {IIdentityService} from '@essential-projects/iam_contracts';

import {wrap} from 'async-middleware';
import {MiddlewareFunction, createResolveIdentityMiddleware} from '../../middlewares/resolve_identity';
import {ProcessModelsController} from './process_models_controller';

export class ProcessModelsRouter extends BaseRouter {

  private identityService: IIdentityService;
  private processModelsController: ProcessModelsController;

  constructor(processModelsController: ProcessModelsController, identityService: IIdentityService) {
    super();
    this.processModelsController = processModelsController;
    this.identityService = identityService;
  }

  public get baseRoute(): string {
    return 'api/process-engine-runtime/v1';
  }

  public initializeRouter(): void {
    this.registerMiddlewares();
    this.registerRoutes();
  }

  private registerMiddlewares(): void {
    const resolveIdentity: MiddlewareFunction = createResolveIdentityMiddleware(this.identityService);
    this.router.use(wrap(resolveIdentity));
  }

  private registerRoutes(): void {}

}
