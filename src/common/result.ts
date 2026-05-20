export class ResultData<T> {
  code: number;
  data: T;
  msg: string;

  constructor(code: number, data: T, msg: string) {
    this.code = code;
    this.data = data;
    this.msg = msg;
  }

  static success<T>(data?: T, msg = '请求成功') {
    return new ResultData(200, data, msg);
  }

  static fail<T>(msg = '请求失败', code = 500, data?: T) {
    return new ResultData(code, data, msg);
  }
}
