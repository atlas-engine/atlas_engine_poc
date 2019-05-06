import {BaseRouter} from '@essential-projects/http_node';
import {IIdentityService} from '@essential-projects/iam_contracts';

import {restSettings} from '@process-engine/deployment_api_contracts';

import {DeploymentApiController} from './deployment_api_controller';
import {createResolveIdentityMiddleware, MiddlewareFunction} from './middlewares/index';

import {wrap} from 'async-middleware';

export class DeploymentApiRouter extends BaseRouter {

  private _deploymentApiController: DeploymentApiController;
  private _identityService: IIdentityService;

  constructor(deploymentApiController: DeploymentApiController, identityService: IIdentityService) {
    super();
    this._deploymentApiController = deploymentApiController;
    this._identityService = identityService;
  }

  private get deploymentApiController(): DeploymentApiController {
    return this._deploymentApiController;
  }

  public get baseRoute(): string {
    return 'api/deployment/v1';
  }

  public async initializeRouter(): Promise<void> {
    this.registerMiddlewares();
    this.registerRoutes();
  }

  private registerMiddlewares(): void {
    const resolveIdentity: MiddlewareFunction = createResolveIdentityMiddleware(this._identityService);
    this.router.use(wrap(resolveIdentity));
  }

  private registerRoutes(): void {
    const controller: DeploymentApiController = this.deploymentApiController;

    this.router.post(restSettings.paths.importProcessModel, wrap(controller.importProcessModel.bind(controller)));
    this.router.post(restSettings.paths.undeployProcessModel, wrap(controller.undeployProcessModel.bind(controller)));
  }
}
