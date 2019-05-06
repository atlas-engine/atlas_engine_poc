import {BaseRouter} from '@essential-projects/http_node';
import {IIdentityService} from '@essential-projects/iam_contracts';

import {restSettings} from '@process-engine/management_api_contracts';

import {createResolveIdentityMiddleware, MiddlewareFunction} from './../../middlewares/resolve_identity';
import {KpiController} from './kpi_controller';

import {wrap} from 'async-middleware';

export class KpiRouter extends BaseRouter {

  private _identityService: IIdentityService;
  private _kpiController: KpiController;

  constructor(kpiController: KpiController, identityService: IIdentityService) {
    super();
    this._kpiController = kpiController;
    this._identityService = identityService;
  }

  public get baseRoute(): string {
    return 'api/process-engine-admin/v1';
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
    this.router.get(restSettings.paths.getRuntimeInformationForProcessModel, wrap(this._kpiController.getRuntimeInformationForProcessModel.bind(this._kpiController)));
    this.router.get(restSettings.paths.getActiveTokensForProcessModel, wrap(this._kpiController.getActiveTokensForProcessModel.bind(this._kpiController)));
    this.router.get(restSettings.paths.getRuntimeInformationForFlowNode, wrap(this._kpiController.getRuntimeInformationForFlowNode.bind(this._kpiController)));
    this.router.get(restSettings.paths.getActiveTokensForFlowNode, wrap(this._kpiController.getActiveTokensForFlowNode.bind(this._kpiController)));
    this.router.get(restSettings.paths.getActiveTokensForProcessInstance, wrap(this._kpiController.getActiveTokensForProcessInstance.bind(this._kpiController)));
    this.router.get(restSettings.paths.getActiveTokensForCorrelationAndProcessModel,
        wrap(this._kpiController.getActiveTokensForCorrelationAndProcessModel.bind(this._kpiController)));
  }
}
