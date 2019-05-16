import {
  AllowNull, BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, Table, UpdatedAt,
} from 'sequelize-typescript';

import {Types} from '@process-engine/persistence_api.contracts';

import {FlowNodeInstanceModel} from './flow_node_instance';

@Table({modelName: 'ProcessToken', tableName: 'ProcessTokens'})
export class ProcessTokenModel extends Model<ProcessTokenModel> {

  @AllowNull(false)
  @Column({type: DataType.STRING})
  public type: Types.FlowNodeInstance.ProcessTokenType;

  @AllowNull(true)
  @Column({type: DataType.TEXT})
  public payload: string;

  @ForeignKey((): typeof FlowNodeInstanceModel => FlowNodeInstanceModel)
  @Column({type: DataType.STRING})
  public flowNodeInstanceId: string;

  @BelongsTo((): typeof FlowNodeInstanceModel => FlowNodeInstanceModel, {
    foreignKey: 'flowNodeInstanceId',
    targetKey: 'flowNodeInstanceId',
  })
  public flowNodeInstance: FlowNodeInstanceModel;

  @CreatedAt
  public createdAt?: Date;

  @UpdatedAt
  public updatedAt?: Date;

}
