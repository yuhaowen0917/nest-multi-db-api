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

    const salt = await bcrypt.genSalt(10);
    const hashPass: string = await bcrypt.hash(password, salt);

    const user = this.userRepo.create({
      username,
      password: hashPass,
      nickname: nickname || username,
    });

    return await this.userRepo.save(user);
  }

  /**
   * 登录
   */
  async login(dto: LoginUserDto) {
    const { username, password } = dto;

    const user = await this.userRepo.findOneBy({ username });
    if (!user) throw new UnauthorizedException('账号不存在');

    const isOk: boolean = await bcrypt.compare(password, user.password);
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
   * 更新用户信息（🔥 修复：密码自动加密）
   */
  async update(id: number, dto: RegisterUserDto) {
    const user = await this.findOne(id);
    if (!user) throw new BadRequestException('用户不存在');

    // 要更新的数据
    const updateData: any = {
      username: dto.username,
      nickname: dto.nickname,
    };

    // 如果前端传了密码 → 加密再存
    if (dto.password && dto.password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      updateData.password = await bcrypt.hash(dto.password, salt);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await this.userRepo.update(id, updateData);
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
