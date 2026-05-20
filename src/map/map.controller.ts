import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MapService } from './map.service';
import { QueryMapDto } from './dto/query-map.dto';

@ApiTags('地图数据map_data接口')
@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get('page')
  @ApiOperation({ summary: '分页+多条件查询' })
  getPage(@Query() query: QueryMapDto) {
    return this.mapService.findPage(query);
  }

  @Get('all')
  @ApiOperation({ summary: '查询全部数据' })
  getAll() {
    return this.mapService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID查询单条' })
  getOne(@Param('id') id: string) {
    return this.mapService.findOne(+id);
  }

  @Get('province/:name')
  @ApiOperation({ summary: '按省份模糊查询' })
  getByProvince(@Param('name') name: string) {
    return this.mapService.findByProvince(name);
  }

  @Get('city/:name')
  @ApiOperation({ summary: '按城市模糊查询' })
  getByCity(@Param('name') name: string) {
    return this.mapService.findByCity(name);
  }
}
