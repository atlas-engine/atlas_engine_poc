import * as moment from 'moment';

import {Metric} from './metric';
import {MetricMeasurementPoint} from './metric_measurement_point';
import {ProcessToken} from './process_token';

/**
 * Contains functions for writing and retrieving content from logfiles,
 * pertaining to metrics.
 * Each file relates to a specific ProcessModel.
 */
export interface IMetricsRepository {

  /**
   * Retrieves the metrics for a specific ProcessModel.
   *
   * @async
   * @param processModelId The ID of ProcessModel for which to retrieve
   *                       the metrics.
   * @returns              A list of metrics.
   */
  readMetricsForProcessModel(processModelId: string): Promise<Array<Metric>>;

  /**
   * Writes a metric for a specific ProcessModel of a Correlation.
   *
   * @async
   * @param correlationId  The ID of the Correlation to which the
   *                       ProcessModel belongs.
   * @param processModelId The ID of ProcessModel for which to create a
   *                       metric.
   * @param metricType     The type of metric (OnEnter, OnExit, onError, etc).
   * @param timestamp      The timestamp to use for the metric.
   * @param error          Optional: When recording an error, this stores the
   *                       error that was encountered.
   *                       Defaults to "now".
   */
  writeMetricForProcessModel(correlationId: string,
                             processModelId: string,
                             metricType: MetricMeasurementPoint,
                             timestamp: moment.Moment,
                             error?: Error): Promise<void>;

  /**
   * Writes a metric for a specific FlowNode of a ProcessModel within a
   * Correlation.
   *
   * @async
   * @param correlationId      The ID of the Correlation to which the
   *                           ProcessModel belongs.
   * @param processModelId     The ID of ProcessModel to which the FlowNode
   *                           belongs.
   * @param flowNodeInstanceId The instance ID of FlowNode for which to create
   *                           a metric.
   * @param flowNodeId         The ID of FlowNode for which to create a
   *                           metric.
   * @param metricType         The type of metric (OnEnter, OnExit, etc).
   * @param processToken       The process token that the FlowNodeInstance had
   *                           at the time the metric was recorded.
   * @param timestamp          The timestamp to use for the metric.
   * @param error              Optional: When recording an error, this stores
   *                           the error that was encountered.
   *                           Defaults to "now".
   */
  writeMetricForFlowNode(correlationId: string,
                         processModelId: string,
                         flowNodeInstanceId: string,
                         flowNodeId: string,
                         metricType: MetricMeasurementPoint,
                         processToken: ProcessToken,
                         timestamp: moment.Moment,
                         error?: Error): Promise<void>;
}
