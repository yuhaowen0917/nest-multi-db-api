import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';

// Sequelize 连接 PostgreSQL
export const sequelizePgConfig = (
  configService: ConfigService,
): SequelizeModuleOptions => ({
  // name: 'pg', // 命名实例：区分数据源
  dialect: 'postgres',
  host: configService.get('PG_HOST'),
  port: configService.get('PG_PORT'),
  username: configService.get('PG_USER'),
  password: configService.get('PG_PASS'),
  database: configService.get('PG_DB'),
  autoLoadModels: true,
  synchronize: true,
  logging: false,
});
