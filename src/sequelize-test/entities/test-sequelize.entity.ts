import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

// 表名：test_sequelize
@Table({ tableName: 'test_sequelize' })
export class TestSequelize extends Model<TestSequelize> {
  @ApiProperty({ description: 'ID' })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @ApiProperty({ description: '名称' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  name: string;

  @ApiProperty({ description: '邮箱' })
  @Column({
    type: DataType.STRING(100),
    unique: true,
  })
  email: string;

  @ApiProperty({ description: '状态' })
  @Column({
    type: DataType.TINYINT,
    defaultValue: 1,
  })
  status: number;
}
