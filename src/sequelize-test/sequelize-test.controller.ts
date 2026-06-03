import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { SequelizeTestService } from './sequelize-test.service';
import { TestDto } from './dto/test.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Sequelize 测试接口')
@Controller('sequelize/test')
export class SequelizeTestController {
  constructor(private readonly sequelizeTestService: SequelizeTestService) {}

  @Post()
  @ApiOperation({ summary: '新增测试数据' })
  create(@Body() dto: TestDto) {
    console.log(dto);
    return this.sequelizeTestService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '查询全部' })
  findAll() {
    return this.sequelizeTestService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '查询单条' })
  findOne(@Param('id') id: string) {
    return this.sequelizeTestService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: '修改' })
  update(@Param('id') id: string, @Body() dto: TestDto) {
    return this.sequelizeTestService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除' })
  remove(@Param('id') id: string) {
    return this.sequelizeTestService.remove(+id);
  }
}
