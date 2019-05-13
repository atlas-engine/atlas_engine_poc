/* eslint-disable @typescript-eslint/no-explicit-any */
import {IIdentity} from '@essential-projects/iam_contracts';

export class ActiveToken {

  public processInstanceId: string;
  public processModelId: string;
  public correlationId: string;
  public flowNodeId: string;
  public flowNodeInstanceId: string;
  public identity: IIdentity;
  public createdAt: Date;
  public payload: any;

}
