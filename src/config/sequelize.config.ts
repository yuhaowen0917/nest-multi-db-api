import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';

/**
 * 独立Sequelize配置：连接PostgreSQL数据库
 * 与原有TypeORM(MySQL)完全分离
 */
export const sequelizeConfig = (
  configService: ConfigService,
): SequelizeModuleOptions => ({
  dialect: 'postgres', // 指定数据库为PostgreSQL
  host: configService.get('PG_HOST'),
  port: configService.get('PG_PORT'),
  username: configService.get('PG_USER'),
  password: configService.get('PG_PASS'),
  database: configService.get('PG_DB'),

  // 自动加载模型、自动建表（仅PostgreSQL库）
  autoLoadModels: true,
  synchronize: true,
  logging: false, // 关闭SQL日志
});
