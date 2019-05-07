import {BaseRouter} from '@essential-projects/http_node';
import {IIdentityService} from '@essential-projects/iam_contracts';

import {restSettings} from '@process-engine/process_engine_admin_api.contracts';

import {wrap} from 'async-middleware';
import {DeploymentController} from './deployment_controller';

import {MiddlewareFunction, createResolveIdentityMiddleware} from '../../middlewares/resolve_identity';

export class DeploymentRouter extends BaseRouter {

  private deploymentApiController: DeploymentController;
  private identityService: IIdentityService;

  constructor(deploymentApiController: DeploymentController, identityService: IIdentityService) {
    super();
    this.deploymentApiController = deploymentApiController;
    this.identityService = identityService;
  }

  public get baseRoute(): string {
    return 'api/deployment/v1';
  }

  public initializeRouter(): void {
    this.registerMiddlewares();
    this.registerRoutes();
  }

  private registerMiddlewares(): void {
    const resolveIdentity: MiddlewareFunction = createResolveIdentityMiddleware(this.identityService);
    this.router.use(wrap(resolveIdentity));
  }

  private registerRoutes(): void {
    const controller: DeploymentController = this.deploymentApiController;

    this.router.post(restSettings.paths.importProcessModel, wrap(controller.importProcessModel.bind(controller)));
    this.router.post(restSettings.paths.undeployProcessModel, wrap(controller.undeployProcessModel.bind(controller)));
  }

}
