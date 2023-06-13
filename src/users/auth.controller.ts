import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUserId } from 'src/decorators/current-user-id.decorator';
import { RefreshTokenGuard } from 'src/guards/refreshToken.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.usersService.login(loginDto);
    return result;
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  refreshAccessToken(@CurrentUserId() userId: number) {
    console.log(userId);
    return this.usersService.refreshAccessToken(userId);
  }
}
