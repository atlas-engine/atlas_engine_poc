import {LogEntry} from './log_entry';
import {LogLevel} from './log_level';

/**
 * Contains functions for writing and retrieving content from logfiles.
 * Each logfile relates to a specific ProcessModel and Correlation.
 */
export interface ILoggingRepository {

  /**
   * Retrieves the logs for a specific ProcessModel.
   * @async
   * @param processModelId The ID of ProcessModel for which to retrieve
   *                       the logs.
   *                       If not set, all logs will be returned.
   * @returns              A list of log entries.
   */
  readLogForProcessModel(processModelId: string): Promise<Array<LogEntry>>;

  /**
   * Writes a log entry for a specific ProcessModel of a Correlation.
   * @async
   * @param correlationId     The ID of the Correlation to which the
   *                          ProcessModel belongs.
   * @param processModelId    The ID of ProcessModel for which to create a
   *                          log entry.
   * @param processInstanceId The instance ID of the ProcessModel.
   * @param logLevel          The loglevel to use.
   * @param message           The message to write into the log entry.
   * @param timestamp         Optional: The timestamp to use for the log entry.
   *                          Defaults to "now".
   */
  writeLogForProcessModel(correlationId: string,
    processModelId: string,
    processInstanceId: string,
    logLevel: LogLevel,
    message: string,
    timestamp?: Date): Promise<void>;

  /**
   * Writes a log entry for a specific FlowNode of a ProcessModel within a
   * Correlation.
   * @async
   * @param correlationId      The ID of the Correlation to which the
   *                           ProcessModel belongs.
   * @param processModelId     The ID of ProcessModel to which the FlowNode
   *                           belongs.
   * @param processInstanceId  The instance ID of the ProcessModel.
   * @param flowNodeInstanceId The instance ID of FlowNode for which to create
   *                           a log entry.
   * @param flowNodeId         The ID of FlowNode for which to create a
   *                           log entry.
   * @param logLevel           The loglevel to use.
   * @param message            The message to write into the log entry.
   * @param timestamp          Optional: The timestamp to use for the log entry.
   *                           Defaults to "now".
   */
  writeLogForFlowNode(correlationId: string,
    processModelId: string,
    processInstanceId: string,
    flowNodeInstanceId: string,
    flowNodeId: string,
    logLevel: LogLevel,
    message: string,
    timestamp?: Date): Promise<void>;
}
