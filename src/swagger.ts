import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const generateDocument = (app) => {
  // 创建swagger接口文档
  const options = new DocumentBuilder()
    .setTitle('vue3-admin') // 标题
    .setDescription('Background system based on Nest.js + Vue3 full stack development') // 描述
    .setVersion('1.0') // 版本
    .addTag('user') // 标签
    .addTag('student') // 标签
    .addTag('girl') // 标签
    .addBearerAuth() // 添加BearerAuth
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
  const port = process.env.PORT || 3000;
  console.log(`swagger文档已生成，访问口：http://localhost:${port}/docs`);

};
