/**
 * Describes the payload that must be send with a handleServiceError HTTP POST request.
 */
export class HandleServiceErrorRequestPayload {

  public readonly workerId: string;
  public readonly errorDetails: string;
  public readonly errorMessage: string;

  constructor(workerId: string, errorMessage: string, errorDetails: string) {
    this.workerId = workerId;
    this.errorMessage = errorMessage;
    this.errorDetails = errorDetails;
  }

}
