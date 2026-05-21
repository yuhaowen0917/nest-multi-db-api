import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterUserDto, LoginUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * 注册
   */
  async register(dto: RegisterUserDto) {
    const { username, password, nickname } = dto;

    const exists = await this.userRepo.findOneBy({ username });
    if (exists) throw new BadRequestException('账号已存在');

    // 密码加密
    const hashPass = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      username,
      password: hashPass,
      nickname: nickname || username,
    });

    return await this.userRepo.save(user);
  }

  /**
   * 登录 仅账号密码
   */
  async login(dto: LoginUserDto) {
    const { username, password } = dto;

    const user = await this.userRepo.findOneBy({ username });
    if (!user) throw new UnauthorizedException('账号不存在');

    const isOk = await bcrypt.compare(password, user.password);
    if (!isOk) throw new UnauthorizedException('密码错误');

    // 生成token
    const token = this.jwtService.sign({
      id: user.id,
      username: user.username,
    });

    return {
      user: { id: user.id, username: user.username, nickname: user.nickname },
      token,
    };
  }

  /**
   * 查询所有
   */
  async findAll() {
    return await this.userRepo.find();
  }

  /**
   * 单条
   */
  async findOne(id: number) {
    return await this.userRepo.findOneBy({ id });
  }

  /**
   * 更新
   */
  async update(id: number, dto: RegisterUserDto) {
    await this.userRepo.update(id, dto);
    return this.findOne(id);
  }

  /**
   * 删除
   */
  async remove(id: number) {
    await this.userRepo.delete(id);
    return '删除成功';
  }
}
