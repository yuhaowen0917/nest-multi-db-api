import { Injectable } from '@nestjs/common';

import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Girl } from './entities/girl.entities';

@Injectable()
export class GirlService {
  getGirls() {
    return {
      code: 200,
      data: ['123', 'qwe', '小红', '789'],
      msg: 'success',
    };
  }

  addGirls() {
    return {
      code: 200,
      data: {
        id: 4,
        name: 'admin',
        age: 23,
      },
      msg: 'success',
    };
  }

  getGirlsById(id: number) {
    let re_json: object = {};
    switch (id) {
      case 1:
        re_json = { id: 1, name: '翠花', age: 18 };
        break;
      case 2:
        re_json = { id: 2, name: '123', age: 18 };
        break;
      case 3:
        re_json = { id: 3, name: '小红', age: 20 };
        break;
      case 4:
        re_json = { id: 4, name: '闪烁', age: 22 };
        break;
    }
    return re_json;
  }

  // 依赖注入
  constructor(
    @InjectRepository(Girl) private readonly girl: Repository<Girl>,
  ) {}

  addGirl() {
    const data = new Girl();
    data.name = '小那数据库连接';
    data.age = 19;
    data.skill = '发的归属感，吃饭，睡觉，打豆豆';
    return this.girl.save(data);
  }

  deletaGirl(id: number) {
    return this.girl.delete(id);
  }

  updateGirl(id: number) {
    const data = new Girl();
    data.name = '柯南';
    data.age = 1;
    return this.girl.update(id, data);
  }

  getAllGirls() {
    return this.girl.find();
  }

  async getGirlsByName(name: string) {
    const data = await this.girl.find({
      where: {
        name: Like(`%${name}%`),
      },
    });
    // console.log(data);

    return data;
  }
}
