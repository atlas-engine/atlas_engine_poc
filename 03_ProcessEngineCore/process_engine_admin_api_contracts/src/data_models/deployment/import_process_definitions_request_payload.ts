/**
 * Contains the request payload required for importing a ProcessDefinition.
 * Includes the raw xml code and the name with which to save it.
 */
export class ImportProcessDefinitionsRequestPayload {
  public name: string;
  public xml: string;
  /**
   * If set to true, any existing ProcessDefinition with the same name will
   * be overwritten.
   * Use with caution.
   */
  public overwriteExisting?: boolean;
}
