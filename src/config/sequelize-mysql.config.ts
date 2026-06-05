import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';

// Sequelize 连接 MySQL
export const sequelizeMysqlConfig = (
  configService: ConfigService,
): SequelizeModuleOptions => ({
  // name: 'mysql', // 命名实例：区分数据源
  dialect: 'mysql',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASS'),
  database: configService.get('DB_NAME'),
  autoLoadModels: true,
  synchronize: true,
  logging: false,
});
