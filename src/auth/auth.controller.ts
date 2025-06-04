import {
  Controller,
  Request,
  Get,
  Post,
  UseGuards,
  Body,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('current')
  getCurrent(@Request() req) {
    return req.user;
  }

  // @UseGuards(LocalAuthGuard) // для локальної стратегії
  // @Post('logout')
  // async logout(@Request() req) {
  //   return req.logout();
  // }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    console.log(req.user);
    await this.authService.logout(req.user.id);
    return { message: 'Logged out successfully' };
  }
}
