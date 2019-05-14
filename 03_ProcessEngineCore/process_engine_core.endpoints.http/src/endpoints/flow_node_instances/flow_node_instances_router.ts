import {BaseRouter} from '@essential-projects/http_node';
import {IIdentityService} from '@essential-projects/iam_contracts';

import {wrap} from 'async-middleware';
import {MiddlewareFunction, createResolveIdentityMiddleware} from '../../middlewares/resolve_identity';
import {FlowNodeInstancesController} from './flow_node_instances_controller';

export class FlowNodeInstancesRouter extends BaseRouter {

  private identityService: IIdentityService;
  private flowNodeInstancesController: FlowNodeInstancesController;

  constructor(flowNodeInstancesController: FlowNodeInstancesController, identityService: IIdentityService) {
    super();
    this.flowNodeInstancesController = flowNodeInstancesController;
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
