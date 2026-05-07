import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// 这里用户名密码请换成自己的，database也可以换成自己的
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '123456',
  database: 'test-user',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
  retryDelay: 500, // 重试连接数据库间隔
  retryAttempts: 10, // 重试连接数据库的次数
  autoLoadEntities: true,
};
