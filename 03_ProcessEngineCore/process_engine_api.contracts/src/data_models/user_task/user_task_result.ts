/**
 * Describes the Payload with which a UserTask can be finished.
 */
export class UserTaskResult {

  /**
   * Contains a list of results for the UserTasks FormFields.
   */
  public formFields: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [fieldId: string]: any;
  };

}
