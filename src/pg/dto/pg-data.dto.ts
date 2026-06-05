import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class PgDataDto {
  @ApiProperty({ description: '名称', example: '测试数据' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '内容', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ description: '状态', required: false })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
