import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

// 注册 DTO
export class RegisterUserDto {
  @ApiProperty({ description: '用户账号', example: 'admin' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: '用户密码', example: '123456' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: '用户昵称',
    example: '系统管理员',
    required: false,
  })
  @IsOptional()
  @IsString()
  nickname?: string;
}

// 登录 DTO
export class LoginUserDto {
  @ApiProperty({ description: '登录账号', example: 'admin' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: '登录密码', example: '123456' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
