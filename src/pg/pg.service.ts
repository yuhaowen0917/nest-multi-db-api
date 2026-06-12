import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PgData } from './entities/pg-data.entity';
import { PgDataDto } from './dto/pg-data.dto';

@Injectable()
export class PgService {
  constructor(
    @InjectModel(PgData, 'postgres')
    private pgDataModel: typeof PgData,
  ) {}

  // 新增
  async create(dto: PgDataDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return await this.pgDataModel.create(dto as any);
  }

  // 查询全部
  async findAll() {
    return await this.pgDataModel.findAll({ order: [['id', 'DESC']] });
  }

  // 查询单条
  async findOne(id: number) {
    return await this.pgDataModel.findByPk(id);
  }

  // 修改
  async update(id: number, dto: PgDataDto) {
    await this.pgDataModel.update(dto, { where: { id } });
    return this.findOne(id);
  }

  // 删除
  async remove(id: number) {
    await this.pgDataModel.destroy({ where: { id } });
    return '删除成功';
  }
}
