import {IIdentity} from '@essential-projects/iam_contracts';

export class ActiveToken<TPayload> {

  public processInstanceId: string;
  public processModelId: string;
  public correlationId: string;
  public flowNodeId: string;
  public flowNodeInstanceId: string;
  public identity: IIdentity;
  public createdAt: Date;
  public payload: TPayload;

}
