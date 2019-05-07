/**
 * Describes the Payload with which a UserTask can be finished.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class UserTaskResult<TFormFieldValue = any> {

  /**
   * Contains a list of results for the UserTasks FormFields.
   */
  public formFields: {
    [fieldId: string]: TFormFieldValue;
  };

}
