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
  @Column({ type: 'varchar', length: 50, nullable: true, comment: '访问时间' })
  accessTime: string | null;

  @ApiProperty({ description: '区域编码' })
  @Column({ type: 'varchar', length: 20, comment: '区域编码' })
  adcode: string;

  @ApiProperty({ description: '城市名称' })
  @Column({ type: 'varchar', length: 50, comment: '城市' })
  city: string;

  @ApiProperty({ description: '数据创建时间' })
  @CreateDateColumn({ comment: '创建时间' })
  createdAt: string;

  @ApiProperty({ description: 'IP地址' })
  @Column({ type: 'varchar', length: 50, comment: 'IP地址' })
  ip: string;

  @ApiProperty({ description: 'IP归属地址' })
  @Column({ type: 'varchar', length: 100, comment: 'IP归属地' })
  ipAddress: string;

  @ApiProperty({ description: '省份名称' })
  @Column({ type: 'varchar', length: 50, comment: '省份' })
  province: string;

  @ApiProperty({ description: '经纬度矩形范围' })
  @Column({ type: 'varchar', length: 255, comment: '经纬度矩形范围' })
  rectangle: string;

  [property: string]: any;
}
