import {ILoggingApi, ILoggingRepository, LogEntry, LogLevel} from '@process-engine/logging_api_contracts';

import {IIAMService, IIdentity} from '@essential-projects/iam_contracts';

export class LoggingApiService implements ILoggingApi {

  private _iamService: IIAMService;
  private _loggingRepository: ILoggingRepository;

  constructor(iamService: IIAMService, loggingRepository: ILoggingRepository) {
    this._iamService = iamService;
    this._loggingRepository = loggingRepository;
  }

  private get iamService(): IIAMService {
    return this._iamService;
  }

  private get loggingRepository(): ILoggingRepository {
    return this._loggingRepository;
  }

  // TODO: Add claim checks as soon as necessary claims have been defined.
  public async readLogForProcessModel(identity: IIdentity, processModelId: string): Promise<Array<LogEntry>> {
    return this.loggingRepository.readLogForProcessModel(processModelId);
  }

  public async writeLogForProcessModel(correlationId: string,
                                       processModelId: string,
                                       processInstanceId: string,
                                       logLevel: LogLevel,
                                       message: string,
                                       timestamp: Date): Promise<void> {
    await this
      .loggingRepository
      .writeLogForProcessModel(correlationId, processModelId, processInstanceId, logLevel, message, timestamp);
  }

  public async writeLogForFlowNode(correlationId: string,
                                   processModelId: string,
                                   processInstanceId: string,
                                   flowNodeInstanceId: string,
                                   flowNodeId: string,
                                   logLevel: LogLevel,
                                   message: string,
                                   timestamp: Date): Promise<void> {
    await this
      .loggingRepository
      .writeLogForFlowNode(correlationId, processModelId, processInstanceId, flowNodeInstanceId, flowNodeId, logLevel, message, timestamp);
  }
}
