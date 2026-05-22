import { ApiProperty } from '@nestjs/swagger';
import { MapData } from '../map-data.entity';

export class MapPageResultDto {
  @ApiProperty({ description: '数据列表', type: [MapData] })
  list: MapData[];

  @ApiProperty({ description: '数据总条数' })
  total: number;

  @ApiProperty({ description: '当前页码' })
  page: number;

  @ApiProperty({ description: '每页条数' })
  size: number;

  @ApiProperty({ description: '总页数' })
  pages: number;
}
