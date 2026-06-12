import { Controller, Get, Param, Query, Post, Body, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('list')
  getList() {
    return {
      code: 200,
      data: [1, 2, 3, 4],
      msg: '请求成功',
    };
  }

  @Get('user/:id')
  getUser(@Param('id') id: string) {
    return {
      userId: id,
      name: '张三',
    };
  }

  @Get('query')
  getQuery(@Query() query: any) {
    return {
      姓名: query.name,
      年龄: query.age,
    };
  }

  @Post('create')
  createData(@Body() body: any) {
    return {
      code: 200,
      data: body,
      msg: '提交成功',
    };
  }

  @Get('env')
  getEnv() {
    const port = this.configService.get('PORT');
    const dbName = this.configService.get('DB_NAME');
    this.logger.log(`环境变量 - PORT: ${port}, DB_NAME: ${dbName}`);
    return {
      服务端口: port,
      数据库名: dbName,
    };
  }
}
