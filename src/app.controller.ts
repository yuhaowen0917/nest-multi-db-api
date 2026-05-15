import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('list')
  getList() {
    return {
      code: 200,
      data: [1, 2, 3, 4],
      msg: '请求成功'
    };
  }

  @Get('user/:id')
  getUser(@Param('id') id: string) {
    return {
      userId: id,
      name: '张三'
    };
  }

  @Get('query')
  getQuery(@Query() query: any) {
    return {
      姓名: query.name,
      年龄: query.age
    };
  }

  @Post('create')
  createData(@Body() body: any) {
    return {
      code: 200,
      data: body,
      msg: '提交成功'
    };
  }
}