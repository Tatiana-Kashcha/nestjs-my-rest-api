import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.create(createUserDto);
    return user;
  }

  // для стратегії "local"
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // для стратегії "jwt"
  async login(userData: any): Promise<UserResponseDto> {
    const payload = {
      sub: userData.id,
      username: userData.name,
      email: userData.email,
    };
    const accessToken = this.jwtService.sign(payload);

    await this.usersService.updateToken(userData.id, accessToken);
    const user = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
    };

    return { user, token: accessToken };
  }

  async logout(userId: number) {
    await this.usersService.updateToken(userId, '');
  }
}
