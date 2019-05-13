import * as moment from 'moment';

import {IIAMService, IIdentity} from '@essential-projects/iam_contracts';

import {
  FlowNodeInstance,
  FlowNodeInstanceState,
  ProcessToken,
} from '@process-engine/flow_node_instance.contracts';
import {APIs, DataModels, Repositories} from '@process-engine/process_engine_admin_api.contracts';

/**
 * Groups Metrics by their FlowNodeIds.
 *
 * Only use internally.
 */
type FlowNodeGroups = {
  [flowNodeId: string]: Array<DataModels.Metrics.Metric>;
};

/**
 * Groups Metrics by their FlowNodeInstanceIds.
 *
 * Only use internally.
 */
type FlowNodeInstanceGroups = {
  [flowNodeInstanceId: string]: Array<DataModels.Metrics.Metric>;
};

/**
 * Contains the quartile runtime data for a FlowNode.
 *
 * Only use internally.
 */
type QuartileInfos = {
  firstQuartile: number;
  median: number;
  thirdQuartile: number;
};

export class KpiApiService implements APIs.IKpiApi {

  private iamService: IIAMService;
  private kpiRepository: Repositories.IKpiRepository;

  constructor(
    iamService: IIAMService,
    kpiRepository: Repositories.IKpiRepository,
  ) {
    this.iamService = iamService;
    this.kpiRepository = kpiRepository;
  }

  public async getRuntimeInformationForProcessModel(
    identity: IIdentity,
    processModelId: string,
  ): Promise<Array<DataModels.Kpi.FlowNodeRuntimeInformation>> {

    const metrics = await this.kpiRepository.readMetricsForProcessModel(processModelId);

    // Do not include FlowNode instances which are still being executed,
    // since they do net yet have a final runtime.
    const filteredMetrics = metrics.filter(this.metricBelongsToFinishedFlowNodeInstance);

    const metricsGroupedByFlowNodeId = this.groupFlowNodeInstancesByFlowNodeId(filteredMetrics);

    const groupKeys = Object.keys(metricsGroupedByFlowNodeId);

    const runtimeInformations = groupKeys.map((flowNodeId: string): DataModels.Kpi.FlowNodeRuntimeInformation => {
      return this.createFlowNodeRuntimeInformation(processModelId, flowNodeId, metricsGroupedByFlowNodeId[flowNodeId]);
    });

    return Promise.resolve(runtimeInformations);
  }

  public async getRuntimeInformationForFlowNode(
    identity: IIdentity,
    processModelId: string,
    flowNodeId: string,
  ): Promise<DataModels.Kpi.FlowNodeRuntimeInformation> {

    const metrics = await this.kpiRepository.readMetricsForProcessModel(processModelId);

    const flowNodeMetrics = metrics.filter((entry: DataModels.Metrics.Metric): boolean => {
      return entry.flowNodeId === flowNodeId;
    });

    // Do not include FlowNode instances which are still being executed,
    // since they do net yet have a final runtime.
    const filteredMetrics = flowNodeMetrics.filter(this.metricBelongsToFinishedFlowNodeInstance);

    const flowNodeRuntimeInformation = this.createFlowNodeRuntimeInformation(processModelId, flowNodeId, filteredMetrics);

    return flowNodeRuntimeInformation;
  }

  public async getActiveTokensForProcessModel(identity: IIdentity, processModelId: string): Promise<Array<DataModels.Kpi.ActiveToken>> {

    const flowNodeInstances = await this.kpiRepository.getFlowNodeInstancesForProcessModel(processModelId);

    const activeFlowNodeInstances = flowNodeInstances.filter(this.isFlowNodeInstanceActive);

    const activeTokenInfos = activeFlowNodeInstances.map(this.createActiveTokenInfoForFlowNodeInstance);

    return activeTokenInfos;
  }

  public async getActiveTokensForCorrelationAndProcessModel(
    identity: IIdentity,
    correlationId: string,
    processModelId: string,
  ): Promise<Array<DataModels.Kpi.ActiveToken>> {

    const activeFlowNodeInstances = await this.kpiRepository.getActiveFlowNodeInstancesForProcessModelInCorrelation(correlationId, processModelId);

    const activeTokenInfos = activeFlowNodeInstances.map(this.createActiveTokenInfoForFlowNodeInstance);

    return activeTokenInfos;
  }

  public async getActiveTokensForProcessInstance(
    identity: IIdentity,
    processInstanceId: string,
  ): Promise<Array<DataModels.Kpi.ActiveToken>> {

    const activeFlowNodeInstances = await this.kpiRepository.getActiveFlowNodeInstancesForProcessInstance(processInstanceId);

    const activeTokenInfos = activeFlowNodeInstances.map(this.createActiveTokenInfoForFlowNodeInstance);

    return activeTokenInfos;
  }

  public async getActiveTokensForFlowNode(
    identity: IIdentity,
    flowNodeId: string,
  ): Promise<Array<DataModels.Kpi.ActiveToken>> {

    const flowNodeInstances = await this.kpiRepository.getActiveFlowNodeInstancesFlowNode(flowNodeId);

    const activeFlowNodeInstances = flowNodeInstances.filter(this.isFlowNodeInstanceActive);

    const activeTokenInfos = activeFlowNodeInstances.map(this.createActiveTokenInfoForFlowNodeInstance);

    return activeTokenInfos;
  }

  /**
   * Array-Filter that checks if a given metric entry is suitable for including
   * it into the runtime calculations.
   *
   * First, it determines if the metric was recorded when the FlowNodeInstance
   * was finished. If so, it is a valid metric entry.
   *
   * If it is a metric that was recorded at the beginnng of a FlowNodeInstance
   * execution, the function checks if a corresponding exiting metric exists.
   *
   * If one is found, the metric is suitable for including it with runtime
   * calculation.
   *
   * If no matching exiting metric could be found, then this likely means the
   * FlowNodeInstance is still running. The metric will not be included in the
   * calculations.
   *
   * @param   metricToCheck      The metric to validate.
   * @param   metricIndex        The index the metric has in the given Array.
   * @param   allFlowNodeMetrics The full Array that is curently being filtered.
   * @returns                    True, if the metric belongs to a finished
   *                             FlowNodeInstance, otherwise false.
   */
  private metricBelongsToFinishedFlowNodeInstance(
    metricToCheck: DataModels.Metrics.Metric,
    metricIndex: number,
    allFlowNodeMetrics: Array<DataModels.Metrics.Metric>,
  ): boolean {

    const metricDoesNotBelongToAFlowNodeInstance = !metricToCheck.flowNodeInstanceId || !metricToCheck.flowNodeId;
    if (metricDoesNotBelongToAFlowNodeInstance) {
      return false;
    }

    const metricWasRecordedOnFlowNodeExit = metricToCheck.metricType === DataModels.Metrics.MetricMeasurementPoint.onFlowNodeExit;
    if (metricWasRecordedOnFlowNodeExit) {
      return true;
    }

    const hasMatchingExitMetric = allFlowNodeMetrics.some((entry: DataModels.Metrics.Metric): boolean => {

      const belongsToSameFlowNodeInstance = metricToCheck.flowNodeInstanceId === entry.flowNodeInstanceId;

      const hasMatchingState = !(entry.metricType === DataModels.Metrics.MetricMeasurementPoint.onFlowNodeEnter ||
                                 entry.metricType === DataModels.Metrics.MetricMeasurementPoint.onFlowNodeSuspend);

      return belongsToSameFlowNodeInstance && hasMatchingState;
    });

    return hasMatchingExitMetric;
  }

  /**
   * Takes a list of Metrics and groups them by the FlowNode they belong to.
   *
   * @param   metrics The metrics to group.
   * @returns         The grouped metrics.
   */
  private groupFlowNodeInstancesByFlowNodeId(metrics: Array<DataModels.Metrics.Metric>): FlowNodeGroups {

    const groupedMetrics: FlowNodeGroups = {};

    for (const metric of metrics) {

      const groupHasNoMatchingEntry = !groupedMetrics[metric.flowNodeId];
      if (groupHasNoMatchingEntry) {
        groupedMetrics[metric.flowNodeId] = [];
      }

      groupedMetrics[metric.flowNodeId].push(metric);
    }

    return groupedMetrics;
  }

  /**
   * Takes an Array of FlowNodeInstances and evaluates their runtimes.
   * The results will be placed in a FlowNodeRuntimeInformation object.
   *
   * @param   processModelId The ID of the ProcessModel that the FlowNode
   *                         belongs to.
   * @param   flowNodeId     The ID of the FlowNode to evaluate.
   * @param   metrics        The list of instances to evaluate.
   * @returns                The FlowNodeRuntimeInformation for the FlowNode.
   */
  private createFlowNodeRuntimeInformation(
    processModelId: string,
    flowNodeId: string,
    metrics: Array<DataModels.Metrics.Metric>,
  ): DataModels.Kpi.FlowNodeRuntimeInformation {

    const groupedMetrics = this.groupMetricsByFlowNodeInstance(metrics);

    const flowNodeInstanceId = Object.keys(groupedMetrics);

    const runtimes = flowNodeInstanceId.map((flowNodeInstanceKey: string): number => {
      return this.calculateRuntimeForFlowNodeInstance(groupedMetrics[flowNodeInstanceKey]);
    });

    const quartileInfos = this.calculateQuartiles(runtimes);

    const runtimeInformation = new DataModels.Kpi.FlowNodeRuntimeInformation();
    runtimeInformation.flowNodeId = flowNodeId;
    runtimeInformation.processModelId = processModelId;
    runtimeInformation.minRuntimeInMs = Math.min(...runtimes);
    runtimeInformation.maxRuntimeInMs = Math.max(...runtimes);
    runtimeInformation.arithmeticMeanRuntimeInMs = this.calculateFlowNodeArithmeticMeanRuntime(runtimes);
    runtimeInformation.firstQuartileRuntimeInMs = quartileInfos.firstQuartile;
    runtimeInformation.medianRuntimeInMs = quartileInfos.median;
    runtimeInformation.thirdQuartileRuntimeInMs = quartileInfos.thirdQuartile;

    return runtimeInformation;
  }

  /**
   * Takes a list of Metrics and groups them by the FlowNodeInstance they belong to.
   *
   * @param metrics
   */
  private groupMetricsByFlowNodeInstance(metrics: Array<DataModels.Metrics.Metric>): FlowNodeInstanceGroups {

    const groupedMetrics: FlowNodeInstanceGroups = {};

    for (const metric of metrics) {

      const groupHasNoMatchingEntry = !groupedMetrics[metric.flowNodeInstanceId];
      if (groupHasNoMatchingEntry) {
        groupedMetrics[metric.flowNodeInstanceId] = [];
      }

      groupedMetrics[metric.flowNodeInstanceId].push(metric);
    }

    return groupedMetrics;
  }

  /**
   * Calculates the total runtime of a FlowNodeInstance by comparing the
   * TimeStamp on the onEnter-Token with the one on the onExit-Token.
   *
   * @param   metrics The FlowNodeInstance for which to calculate the
   *                           runtime
   * @returns                  The calculated runtime.
   */
  private calculateRuntimeForFlowNodeInstance(metrics: Array<DataModels.Metrics.Metric>): number {

    const onEnterMetric = metrics.find((token: DataModels.Metrics.Metric): boolean => {
      return token.metricType === DataModels.Metrics.MetricMeasurementPoint.onFlowNodeEnter;
    });

    const onExitMetric = metrics.find((token: DataModels.Metrics.Metric): boolean => {
      return token.metricType === DataModels.Metrics.MetricMeasurementPoint.onFlowNodeExit ||
             token.metricType === DataModels.Metrics.MetricMeasurementPoint.onFlowNodeError;
    });

    const startTime = moment(onEnterMetric.timeStamp);
    const endTime = moment(onExitMetric.timeStamp);

    const runtimeDiff = endTime.diff(startTime);
    const runtimeTotal = moment
      .duration(runtimeDiff)
      .asMilliseconds();

    return runtimeTotal;
  }

  /**
   * Calculates the quartiles for the given set of runtimes.
   *
   * @param   runtimes The set of runtimes for which to calculate the quartiles.
   * @returns          A set of quartiles.
   */
  private calculateQuartiles(runtimes: Array<number>): QuartileInfos {

    const runtimeAmounts = runtimes.length;

    const sortedRuntimes = runtimes.sort((prevValue: number, currentValue: number): number => {
      return prevValue - currentValue;
    });

    let quartileAmounts: number;
    let medianAmounts: number;

    let firstQuartileData: Array<number>;
    let medianQuartileData: Array<number>;
    let thirdQuartileData: Array<number>;

    // tslint:disable:no-magic-numbers
    if (runtimeAmounts >= 3) {
      // We have enough data to reasonably extrapolate the quartiles.
      quartileAmounts = Math.floor(runtimes.length / 4);
      medianAmounts = Math.ceil(runtimes.length / 2);

      firstQuartileData = sortedRuntimes.slice(0, quartileAmounts);
      medianQuartileData = sortedRuntimes.slice(quartileAmounts, quartileAmounts + medianAmounts);
      thirdQuartileData = sortedRuntimes.slice(sortedRuntimes.length - quartileAmounts);
    } else {
      // There is not enough data to reasonably extrapolate quartiles.
      // Use all available data for each quartile instead.
      quartileAmounts = runtimeAmounts;
      medianAmounts = runtimeAmounts;

      firstQuartileData = sortedRuntimes;
      medianQuartileData = sortedRuntimes;
      thirdQuartileData = sortedRuntimes;
    }

    const firstQuartileRuntime = this.calculateFlowNodeArithmeticMeanRuntime(firstQuartileData);
    const medianQuartileRuntime = this.calculateFlowNodeArithmeticMeanRuntime(medianQuartileData);
    const thirdQuartileRuntime = this.calculateFlowNodeArithmeticMeanRuntime(thirdQuartileData);

    return {
      firstQuartile: firstQuartileRuntime,
      median: medianQuartileRuntime,
      thirdQuartile: thirdQuartileRuntime,
    };
  }

  /**
   * Calculates the arithmetic mean runtime from the given set of runtimes.
   *
   * @param   runtimes The set of runtimes.
   * @returns          The calculated mean runtime.
   */
  private calculateFlowNodeArithmeticMeanRuntime(runtimes: Array<number>): number {

    const allRuntimes = runtimes.reduce((previousValue: number, currentValue: number): number => {
      return previousValue + currentValue;
    }, 0);

    const meanRuntime = Math.round(allRuntimes / runtimes.length);

    return meanRuntime;
  }

  /**
   * Checks if a given FlowNode instance is currently in an active state.
   *
   * @param   flowNodeInstance The FlowNode for which to determine the state.
   * @returns                  True, if the instance is active, otherwise false.
   */
  private isFlowNodeInstanceActive(flowNodeInstance: FlowNodeInstance): boolean {
    return flowNodeInstance.state === FlowNodeInstanceState.running
      || flowNodeInstance.state === FlowNodeInstanceState.suspended;
  }

  /**
   * Converts the given FlowNodeInstance object into an ActiveToken object.
   *
   * @param   flowNodeInstance The FlowNodeInstance to convert.
   * @returns                  The created ActiveToken.
   */
  private createActiveTokenInfoForFlowNodeInstance(flowNodeInstance: FlowNodeInstance): DataModels.Kpi.ActiveToken {

    const currentProcessToken: ProcessToken = flowNodeInstance.tokens[0];

    const activeTokenInfo = new DataModels.Kpi.ActiveToken();
    activeTokenInfo.processInstanceId = currentProcessToken.processInstanceId;
    activeTokenInfo.processModelId = currentProcessToken.processModelId;
    activeTokenInfo.correlationId = currentProcessToken.correlationId;
    activeTokenInfo.flowNodeId = flowNodeInstance.flowNodeId;
    activeTokenInfo.flowNodeInstanceId = flowNodeInstance.id;
    activeTokenInfo.identity = currentProcessToken.identity;
    activeTokenInfo.createdAt = currentProcessToken.createdAt;
    activeTokenInfo.payload = currentProcessToken.payload;

    return activeTokenInfo;
  }

}
