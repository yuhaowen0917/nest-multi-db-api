import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { PgData } from '../pg/entities/pg-data.entity';

// Sequelize 连接 PostgreSQL
export const sequelizePgConfig = (
  configService: ConfigService,
): SequelizeModuleOptions => ({
  // name 由 forRootAsync 的顶层传入，此处不需要
  dialect: 'postgres',
  host: configService.get('PG_HOST'),
  port: configService.get('PG_PORT'),
  username: configService.get('PG_USER'),
  password: configService.get('PG_PASS'),
  database: configService.get('PG_DB'),
  autoLoadModels: false,
  models: [PgData],
  synchronize: configService.get('NODE_ENV') === 'development', // ⚠️ 仅开发环境自动同步
  logging: false,
});
