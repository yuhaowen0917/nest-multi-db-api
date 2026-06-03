import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { typeOrmConfig } from './ormconfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat/chat.gateway';
import { MapModule } from './map/map.module';
import { UserModule } from './user/user.module';
import { SequelizeTestModule } from './sequelize-test/sequelize-test.module';

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
      useFactory: (config: ConfigService) => ({
        dialect: 'mysql',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASS'),
        database: config.get('DB_NAME'), // 连接同一个 blog 库
        autoLoadModels: true, // 自动加载模型
        synchronize: true, // 仅为 Sequelize 模型自动建表（不影响原有表）
        logging: false, // 关闭日志
      }),
    }),
    MapModule,
    UserModule,
    SequelizeTestModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
