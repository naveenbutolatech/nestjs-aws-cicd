import { Controller, Post, Body, NotFoundException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/users/dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

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

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;

    // Call service to handle the forgot password logic
    try {
      await this.authService.sendPasswordResetEmail(email);
      return { message: 'Password reset link sent to your email.' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found');
      }
      throw new BadRequestException('Cannot process request');
    }
  }
}
