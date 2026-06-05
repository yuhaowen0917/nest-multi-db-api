import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PgService } from './pg.service';
import { PgDataDto } from './dto/pg-data.dto';

@ApiTags('PostgreSQL-Sequelize 通用接口')
@Controller('pg')
export class PgController {
  constructor(private readonly pgService: PgService) {}

  @Post()
  @ApiOperation({ summary: '新增PostgreSQL数据' })
  create(@Body() dto: PgDataDto) {
    return this.pgService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '查询全部数据' })
  findAll() {
    return this.pgService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID查询' })
  findOne(@Param('id') id: string) {
    return this.pgService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: '修改数据' })
  update(@Param('id') id: string, @Body() dto: PgDataDto) {
    return this.pgService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除数据' })
  remove(@Param('id') id: string) {
    return this.pgService.remove(+id);
  }
}
