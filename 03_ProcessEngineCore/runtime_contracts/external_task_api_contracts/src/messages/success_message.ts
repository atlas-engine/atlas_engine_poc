/**
 * Contains a message about a successfully finished ExternalTask.
 */
export class ExternalTaskSuccessMessage {

  public readonly result: any;

  constructor(result: any) {
    this.result = result;
  }

}
