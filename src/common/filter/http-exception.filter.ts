import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ResultData } from '../result';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // 默认值
    let code = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器异常';

    // 如果是 Nest 标准 HttpException
    if (exception instanceof HttpException) {
      code = exception.getStatus();
      const err = exception.getResponse();

      // 兼容 Nest 校验错误的格式
      if (typeof err === 'object') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        message = (err as any).message || exception.message;
      } else {
        message = err;
      }
    }

    // 如果是普通错误
    else if (exception instanceof Error) {
      message = exception.message;
    }

    // 统一格式返回给前端
    response.status(HttpStatus.OK);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.json(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      ResultData.fail(Array.isArray(message) ? message[0] : message, code),
    );
  }
}
