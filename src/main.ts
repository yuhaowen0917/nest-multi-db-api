import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { generateDocument } from './swagger';
import { ValidationPipe } from '@nestjs/common';
import cors from 'cors';
import helmet from 'helmet';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';

// 热重载核心代码
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 设置全局路由前缀
  // app.setGlobalPrefix('api');

  // 全局校验管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动剔除 DTO 未定义字段
      transform: true, // 自动类型转换 string=>number
      forbidNonWhitelisted: true, // 禁止传多余字段
    }),
  );

  // 跨域
  app.use(cors());
  // 安全头部
  app.use(helmet());

  // 全局响应拦截
  app.useGlobalInterceptors(new ResponseInterceptor());
  // 全局异常过滤
  app.useGlobalFilters(new HttpExceptionFilter());

  // 创建swagger文档
  generateDocument(app);

  // 启动应用
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`http://localhost:${port}`);
  console.log(
    `${process.env.NODE_ENV ?? 'development'} 服务运行在端口：${port}`,
  );

  // 热重载监听
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (module.hot) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    module.hot.accept();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
