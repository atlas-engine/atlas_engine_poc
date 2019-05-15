/**
 * Describes the payload that must be send with a handleBpmnError HTTP POST request.
 */
export class HandleBpmnErrorRequestPayload {

  public readonly workerId: string;
  public readonly errorCode: string;

  constructor(workerId: string, errorCode: string) {
    this.workerId = workerId;
    this.errorCode = errorCode;
  }

}
