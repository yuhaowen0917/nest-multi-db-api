import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, comment: '账号' })
  username: string;

  @Column({ comment: '密码' })
  password: string;

  @Column({ nullable: true, comment: '昵称' })
  nickname: string;

  @Column({ default: 1, comment: '状态 1正常 0禁用' })
  status: number;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}
