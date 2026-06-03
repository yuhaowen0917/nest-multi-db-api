import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TestSequelize } from './entities/test-sequelize.entity';
import { TestDto } from './dto/test.dto';

@Injectable()
export class SequelizeTestService {
  constructor(
    @InjectModel(TestSequelize)
    private testModel: typeof TestSequelize,
  ) {}

  // 新增
  async create(dto: TestDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return await this.testModel.create(dto as any);
  }

  // 查询全部
  async findAll() {
    return await this.testModel.findAll();
  }

  // 查询单条
  async findOne(id: number) {
    return await this.testModel.findByPk(id);
  }

  // 修改
  async update(id: number, dto: TestDto) {
    await this.testModel.update(dto, { where: { id } });
    return this.findOne(id);
  }

  // 删除
  async remove(id: number) {
    await this.testModel.destroy({ where: { id } });
    return '删除成功';
  }
}
