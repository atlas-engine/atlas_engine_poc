import {BaseRouter} from '@essential-projects/http_node';
import {IIdentityService} from '@essential-projects/iam_contracts';

import {wrap} from 'async-middleware';
import {MiddlewareFunction, createResolveIdentityMiddleware} from '../../middlewares/resolve_identity';
import {CorrelationsController} from './correlations_controller';

export class CorrelationsRouter extends BaseRouter {

  private identityService: IIdentityService;
  private correlationsController: CorrelationsController;

  constructor(correlationsController: CorrelationsController, identityService: IIdentityService) {
    super();
    this.correlationsController = correlationsController;
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
