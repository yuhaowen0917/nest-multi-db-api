import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export const generateDocument = (app: INestApplication) => {
  // 创建swagger接口文档
  const options = new DocumentBuilder()
    .setTitle('vue3-admin') // 标题
    .setDescription('基于Nest.js + Vue3的全栈开发后台管理系统') // 描述
    .setVersion('1.0') // 版本
    .addBearerAuth() // 添加BearerAuth
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
  const port = process.env.PORT || 3000;
  console.log(`swagger文档已生成，访问口：http://localhost:${port}/docs`);
};
