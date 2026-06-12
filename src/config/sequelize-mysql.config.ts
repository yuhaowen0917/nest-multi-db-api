import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { TestSequelize } from '../sequelize-test/entities/test-sequelize.entity';

// Sequelize 连接 MySQL
export const sequelizeMysqlConfig = (
  configService: ConfigService,
): SequelizeModuleOptions => ({
  // name 由 forRootAsync 的顶层传入，此处不需要
  dialect: 'mysql',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASS'),
  database: configService.get('DB_NAME'),
  autoLoadModels: false,
  models: [TestSequelize],
  synchronize: configService.get('NODE_ENV') === 'development', // ⚠️ 仅开发环境自动同步
  logging: false,
});
