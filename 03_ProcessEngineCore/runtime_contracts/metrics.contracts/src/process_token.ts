import {IIdentity} from '@essential-projects/iam_contracts';
import {ProcessTokenType} from './process_token_type';

export class ProcessToken {
  // header
  public processInstanceId: string;
  public processModelId: string;
  public correlationId: string;
  public identity: IIdentity;
  public createdAt: Date;
  public caller: string; // empty if this started the correlation
  public type: ProcessTokenType;
  // payload
  public payload: any;
}
