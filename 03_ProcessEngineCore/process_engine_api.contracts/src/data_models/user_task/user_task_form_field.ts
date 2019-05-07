import {UserTaskEnumValue} from './user_task_enum_value';
import {UserTaskFormFieldType} from './user_task_form_field_type';

/**
 * Contains information about a UserTasks FormField.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class UserTaskFormField<TDefaultValue = any> {

  public id: string;
  public type: UserTaskFormFieldType;
  public label: string;
  public defaultValue?: TDefaultValue;
  public preferredControl?: string;
  /**
   * Optional: If the FormField is an enumeration,
   * this will contain the values for that enumeration.
   */
  public enumValues?: Array<UserTaskEnumValue>;

}
