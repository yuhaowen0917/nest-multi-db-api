import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { generateDocument } from './swagger';
import { ValidationPipe } from '@nestjs/common';
import cors from 'cors';
import helmet from 'helmet';

// 热重载核心代码
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 设置全局路由前缀
  // app.setGlobalPrefix('api');
  // 创建swagger文档
  generateDocument(app);

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

  // 启动应用
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`http://localhost:${port}`);
  console.log(`${process.env.NODE_ENV ?? 'development'} 服务运行在端口：${port}`);

  // 热重载监听
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
