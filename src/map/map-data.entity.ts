import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('map_data')
export class MapData {
  @ApiProperty({ description: '主键ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '访问时间', nullable: true })
  @Column({
    type: 'varchar',
    name: 'access_time', // 关键！指定数据库列名
    nullable: true,
    comment: '访问时间',
  })
  accessTime: string | null;

  @ApiProperty({ description: '区域编码' })
  @Column({ type: 'varchar', comment: '区域编码' })
  adcode: string;

  @ApiProperty({ description: '城市名称' })
  @Column({ type: 'varchar', comment: '城市' })
  city: string;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @ApiProperty({ description: 'IP地址' })
  @Column({ type: 'varchar', comment: 'IP地址' })
  ip: string;

  @ApiProperty({ description: 'IP归属地' })
  @Column({ type: 'varchar', name: 'ip_address', comment: 'IP归属地' })
  ipAddress: string;

  @ApiProperty({ description: '省份' })
  @Column({ type: 'varchar', comment: '省份' })
  province: string;

  @ApiProperty({ description: '经纬度范围' })
  @Column({ type: 'varchar', comment: '经纬度矩形范围' })
  rectangle: string;

  [property: string]: any;
}
