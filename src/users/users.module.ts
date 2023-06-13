import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RefreshTokenStrategy } from 'src/strategies/refreshToken.strategy';
import { AdminStrategy } from 'src/strategies/admin.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
    PassportModule,
  ],
  controllers: [UsersController, AuthController],
  providers: [UsersService, RefreshTokenStrategy, AdminStrategy],
})
export class UsersModule {}
