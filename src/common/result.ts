import { ApiProperty } from '@nestjs/swagger';

export class ResultData<T> {
  @ApiProperty({ description: '状态码', example: 200 })
  code: number;

  @ApiProperty({ description: '返回数据' })
  data: T;

  @ApiProperty({ description: '提示信息', example: '请求成功' })
  msg: string;

  constructor(code: number, data: T, msg: string) {
    this.code = code;
    this.data = data;
    this.msg = msg;
  }

  static success<T>(data?: T, msg = '请求成功') {
    return new ResultData(200, data as T, msg);
  }

  static fail<T>(msg = '请求失败', code = 500, data?: T) {
    return new ResultData(code, data as T, msg);
  }
}
