// auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/users/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

@Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    const { emailOrPhone, password } = loginDto;

    const user = await this.authService.validateUser(
      emailOrPhone,password
    );
    return this.authService.login(user);
  }

}