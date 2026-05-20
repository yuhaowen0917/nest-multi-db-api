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
    const res = ctx.getResponse<Response>();

    let code = HttpStatus.INTERNAL_SERVER_ERROR;
    let msg = '服务器内部错误';

    if (exception instanceof HttpException) {
      code = exception.getStatus();
      const errRes = exception.getResponse();
      msg = typeof errRes === 'string' ? errRes : (errRes as any).message || msg;
    }

    res.status(HttpStatus.OK).json(ResultData.fail(msg, code));
  }
}
