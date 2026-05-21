import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

// 注册DTO（账号+密码+可选昵称）
export class RegisterUserDto {
  @ApiProperty({ description: '账号' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: '昵称', required: false })
  @IsOptional()
  @IsString()
  nickname?: string;
}

// 登录DTO（仅账号密码）
export class LoginUserDto {
  @ApiProperty({ description: '登录账号' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: '登录密码' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
