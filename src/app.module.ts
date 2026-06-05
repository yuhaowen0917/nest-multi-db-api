import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { typeOrmConfig } from './ormconfig';
// 双 Sequelize 独立配置
// import { sequelizeMysqlConfig } from './config/sequelize-mysql.config';
import { sequelizePgConfig } from './config/sequelize-pg.config';

import { ChatGateway } from './chat/chat.gateway';
import { MapModule } from './map/map.module';
import { UserModule } from './user/user.module';
// import { SequelizeTestModule } from './sequelize-test/sequelize-test.module';
import { PgModule } from './pg/pg.module';
@Module({
  imports: [
    // 🔥 核心：加载环境变量
    ConfigModule.forRoot({
      isGlobal: true, // 全局可用，不需要每个模块都导入
      envFilePath: `.env.${process.env.NODE_ENV ?? 'development'}`,
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf((info) => {
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              return `[${info.timestamp}] ${info.level}: ${info.message}`;
            }),
          ),
        }),
      ],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => typeOrmConfig(config),
    }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: sequelizePgConfig, // 引入独立配置文件
    }),
    MapModule,
    UserModule,
    // SequelizeTestModule,
    PgModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
