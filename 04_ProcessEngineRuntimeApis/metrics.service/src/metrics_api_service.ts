import * as moment from 'moment';

import {
  IMetricsApi, IMetricsRepository, MetricMeasurementPoint, ProcessToken,
} from '@process-engine/metrics_api_contracts';

export class MetricsApiService implements IMetricsApi {

  private _metricsRepository: IMetricsRepository;

  constructor(metricsRepository: IMetricsRepository) {
    this._metricsRepository = metricsRepository;
  }

  private get metricsRepository(): IMetricsRepository {
    return this._metricsRepository;
  }

  public async writeOnProcessStarted(correlationId: string, processModelId: string, timestamp: moment.Moment): Promise<void> {
    await this.metricsRepository.writeMetricForProcessModel(correlationId, processModelId, MetricMeasurementPoint.onProcessStart, timestamp);
  }

  public async writeOnProcessFinished(correlationId: string, processModelId: string, timestamp: moment.Moment): Promise<void> {
    await this.metricsRepository.writeMetricForProcessModel(correlationId, processModelId, MetricMeasurementPoint.onProcessFinish, timestamp);
  }

  public async writeOnProcessError(correlationId: string, processModelId: string, error: Error, timestamp: moment.Moment): Promise<void> {
    await this.metricsRepository.writeMetricForProcessModel(correlationId, processModelId, MetricMeasurementPoint.onProcessError, timestamp, error);
  }

  public async writeOnFlowNodeInstanceEnter(
    correlationId: string,
    processModelId: string,
    flowNodeInstanceId: string,
    flowNodeId: string,
    processToken: ProcessToken,
    timestamp: moment.Moment,
  ): Promise<void> {

    await this.metricsRepository.writeMetricForFlowNode(
      correlationId,
      processModelId,
      flowNodeInstanceId,
      flowNodeId,
      MetricMeasurementPoint.onFlowNodeEnter,
      processToken,
      timestamp,
    );
  }

  public async writeOnFlowNodeInstanceExit(
    correlationId: string,
    processModelId: string,
    flowNodeInstanceId: string,
    flowNodeId: string,
    processToken: ProcessToken,
    timestamp: moment.Moment,
  ): Promise<void> {

    await this.metricsRepository.writeMetricForFlowNode(
      correlationId,
      processModelId,
      flowNodeInstanceId,
      flowNodeId,
      MetricMeasurementPoint.onFlowNodeExit,
      processToken,
      timestamp,
    );
  }

  public async writeOnFlowNodeInstanceError(
    correlationId: string,
    processModelId: string,
    flowNodeInstanceId: string,
    flowNodeId: string,
    processToken: ProcessToken,
    error: Error,
    timestamp: moment.Moment,
  ): Promise<void> {

    await this.metricsRepository.writeMetricForFlowNode(
      correlationId,
      processModelId,
      flowNodeInstanceId,
      flowNodeId,
      MetricMeasurementPoint.onFlowNodeError,
      processToken,
      timestamp,
      error,
    );
  }

  public async writeOnFlowNodeInstanceSuspend(
    correlationId: string,
    processModelId: string,
    flowNodeInstanceId: string,
    flowNodeId: string,
    processToken: ProcessToken,
    timestamp: moment.Moment,
  ): Promise<void> {

    await this.metricsRepository.writeMetricForFlowNode(
      correlationId,
      processModelId,
      flowNodeInstanceId,
      flowNodeId,
      MetricMeasurementPoint.onFlowNodeSuspend,
      processToken,
      timestamp,
    );
  }

  public async writeOnFlowNodeInstanceResume(
    correlationId: string,
    processModelId: string,
    flowNodeInstanceId: string,
    flowNodeId: string,
    processToken: ProcessToken,
    timestamp: moment.Moment,
  ): Promise<void> {

    await this.metricsRepository.writeMetricForFlowNode(
      correlationId,
      processModelId,
      flowNodeInstanceId,
      flowNodeId,
      MetricMeasurementPoint.onFlowNodeResume,
      processToken,
      timestamp,
    );
  }

}
