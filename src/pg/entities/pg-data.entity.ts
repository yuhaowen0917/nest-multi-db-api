import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'pg_data' })
export class PgData extends Model<PgData> {
  // 主键
  @ApiProperty({ description: '主键ID' })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  // 👇 全部加 declare，消除警告
  @ApiProperty({ description: '数据名称' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  declare name: string;

  @ApiProperty({ description: '数据内容' })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare content?: string;

  @ApiProperty({ description: '状态 0-禁用 1-正常' })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare status: boolean;
}
