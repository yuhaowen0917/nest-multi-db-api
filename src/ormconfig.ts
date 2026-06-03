import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const typeOrmConfig = (config: ConfigService): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: config.get('DB_HOST'),
  port: config.get('DB_PORT'),
  username: config.get('DB_USER'),
  password: config.get('DB_PASS'),
  database: config.get('DB_NAME'),
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  // synchronize: config.get('NODE_ENV') === 'development', // 仅开发自动建表
  synchronize: false,
  retryDelay: 500,
  retryAttempts: 10,
  autoLoadEntities: true,
});
