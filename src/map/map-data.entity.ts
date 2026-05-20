import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('map_data')
export class MapData {
  @PrimaryGeneratedColumn()
  id: number;

  // 🔥 修复这里：必须明确指定数据库类型
  @Column({ type: 'varchar', length: 255, nullable: true, comment: '访问时间' })
  accessTime: string | null;

  @Column({ type: 'varchar', length: 255, comment: '区域编码' })
  adcode: string;

  @Column({ type: 'varchar', length: 255, comment: '城市' })
  city: string;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: string;

  @Column({ type: 'varchar', length: 255, comment: 'IP地址' })
  ip: string;

  @Column({ type: 'varchar', length: 255, comment: 'IP归属地' })
  ipAddress: string;

  @Column({ type: 'varchar', length: 255, comment: '省份' })
  province: string;

  @Column({ type: 'varchar', length: 255, comment: '经纬度矩形范围' })
  rectangle: string;

  // 这个只是 TS 类型，不会映射到数据库，所以没问题
  [property: string]: any;
}
