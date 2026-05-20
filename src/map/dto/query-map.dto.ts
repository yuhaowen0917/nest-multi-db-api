import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class QueryMapDto {
  @ApiProperty({ description: '页码', default: 1, required: false })
  @IsOptional()
  @Type(() => Number) // 🔥 自动转数字
  page?: number = 1;

  @ApiProperty({ description: '每页条数', default: 10, required: false })
  @IsOptional()
  @Type(() => Number) // 🔥 自动转数字
  size?: number = 10;

  @ApiProperty({ description: '省份模糊查询', required: false })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiProperty({ description: '城市模糊查询', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ description: '区域编码', required: false })
  @IsString()
  @IsOptional()
  adcode?: string;

  @ApiProperty({ description: '开始时间', required: false })
  @IsString()
  @IsOptional()
  startTime?: string;

  @ApiProperty({ description: '结束时间', required: false })
  @IsString()
  @IsOptional()
  endTime?: string;
}
