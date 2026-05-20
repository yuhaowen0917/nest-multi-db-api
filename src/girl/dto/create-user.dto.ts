import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsNumber()
  age?: number;
}
