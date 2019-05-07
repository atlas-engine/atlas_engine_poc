import {BaseRouter} from '@essential-projects/http_node';
import {IIdentityService} from '@essential-projects/iam_contracts';

import {restSettings} from '@process-engine/process_engine_admin_api.contracts';

import {wrap} from 'async-middleware';
import {MiddlewareFunction, createResolveIdentityMiddleware} from '../../middlewares/resolve_identity';
import {KpiController} from './kpi_controller';

export class KpiRouter extends BaseRouter {

  private identityService: IIdentityService;
  private kpiController: KpiController;

  constructor(kpiController: KpiController, identityService: IIdentityService) {
    super();
    this.kpiController = kpiController;
    this.identityService = identityService;
  }

  public get baseRoute(): string {
    return 'api/process-engine-admin/v1';
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
    this.router.get(
      restSettings.paths.getRuntimeInformationForProcessModel,
      wrap(this.kpiController.getRuntimeInformationForProcessModel.bind(this.kpiController)),
    );
    this.router.get(
      restSettings.paths.getActiveTokensForProcessModel,
      wrap(this.kpiController.getActiveTokensForProcessModel.bind(this.kpiController)),
    );
    this.router.get(
      restSettings.paths.getRuntimeInformationForFlowNode,
      wrap(this.kpiController.getRuntimeInformationForFlowNode.bind(this.kpiController)),
    );
    this.router.get(
      restSettings.paths.getActiveTokensForFlowNode,
      wrap(this.kpiController.getActiveTokensForFlowNode.bind(this.kpiController)),
    );
    this.router.get(
      restSettings.paths.getActiveTokensForProcessInstance,
      wrap(this.kpiController.getActiveTokensForProcessInstance.bind(this.kpiController)),
    );
    this.router.get(
      restSettings.paths.getActiveTokensForCorrelationAndProcessModel,
      wrap(this.kpiController.getActiveTokensForCorrelationAndProcessModel.bind(this.kpiController)),
    );
  }

}
