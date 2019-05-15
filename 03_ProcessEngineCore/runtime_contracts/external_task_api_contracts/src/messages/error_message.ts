/**
 * Contains a message about a failed ExternalTask.
 */
export class ExternalTaskErrorMessage {

  public readonly error: Error;

  constructor(error: Error) {
    this.error = error;
  }
}
