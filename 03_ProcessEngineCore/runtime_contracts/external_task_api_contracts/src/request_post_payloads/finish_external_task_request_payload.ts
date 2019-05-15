/**
 * Describes the payload that must be send with a finishExternalTask HTTP POST request.
 */
export class FinishExternalTaskRequestPayload<TResultType> {

  public readonly workerId: string;
  public readonly result: any;

  constructor(workerId: string, result: TResultType) {
    this.workerId = workerId;
    this.result = result;
  }
}
