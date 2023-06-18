import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const userExists = await this.repo.findOne({ where: { email } });

    if (userExists) {
      throw new BadRequestException('User with this email already exists');
    }

    const user = this.repo.create({
      email,
      password: await argon2.hash(password),
    });
    await this.repo.save(user);
    return user;
  }

  async findAll() {
    const users = await this.repo.find();

    return users;
  }

  async findOne(id: number) {
    const user = await this.repo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async findUser(id: number) {
    const user = await this.repo.findOne({ where: { id } });

    return user;
  }

  async getTokens(userId: number) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
        },
        {
          secret: `${process.env.JWT_ACCESS_SECRET}`,
          expiresIn: '7d',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
        },
        {
          secret: `${process.env.JWT_REFRESH_SECRET}`,
          expiresIn: '30d',
        },
      ),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  async refreshAccessToken(userId: number) {
    const user = await this.findOne(userId);
    if (!user) {
      throw new BadRequestException('bad token');
    }
    const tokens = await this.getTokens(userId);
    return tokens;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.repo.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User do not exists');
    }

    const passwordMatches = await argon2.verify(user.password, password);

    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');

    const tokens = await this.getTokens(user.id);
    return tokens;
  }
}
