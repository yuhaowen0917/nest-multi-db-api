import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { MapData } from './map-data.entity';
import { QueryMapDto } from './dto/query-map.dto';

@Injectable()
export class MapService {
  constructor(
    @InjectRepository(MapData)
    private mapRepository: Repository<MapData>,
  ) {}

  /**
   * 1. 分页 + 多条件查询（最常用）
   */
  async findPage(query: QueryMapDto) {
    const {
      page = 1,
      size = 10,
      province,
      city,
      adcode,
      startTime,
      endTime,
    } = query;

    const where: any = {};

    // 拼接条件
    if (province) where.province = Like(`%${province}%`);
    if (city) where.city = Like(`%${city}%`);
    if (adcode) where.adcode = adcode;
    if (startTime && endTime) where.createdAt = Between(startTime, endTime);

    const [list, total] = await this.mapRepository.findAndCount({
      where,
      order: { id: 'DESC' },
      skip: (page - 1) * size,
      take: size,
    });

    return {
      list,
      total,
      page: +page,
      size: +size,
      pages: Math.ceil(total / size),
    };
  }

  /**
   * 2. 查询所有（不分页）
   */
  async findAll() {
    return await this.mapRepository.find({ order: { id: 'DESC' } });
  }

  /**
   * 3. 根据 ID 查询单条
   */
  async findOne(id: number) {
    return await this.mapRepository.findOneBy({ id });
  }

  /**
   * 4. 根据省份查询
   */
  async findByProvince(province: string) {
    return await this.mapRepository.find({
      where: { province: Like(`%${province}%`) },
    });
  }

  /**
   * 5. 根据城市查询
   */
  async findByCity(city: string) {
    return await this.mapRepository.find({
      where: { city: Like(`%${city}%`) },
    });
  }
}
