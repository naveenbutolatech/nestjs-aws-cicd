import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { UserService } from '../users/user.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  private readonly logger: Logger;
  private userService: UserService;
  private jwtService: JwtService; 
  private emailService: EmailService;

  constructor(
    userService: UserService,
    jwtService: JwtService,
    emailService: EmailService,
  ) {
    this.logger = new Logger(AuthService.name);
    this.userService = userService;
    this.jwtService = jwtService;
    this.emailService = emailService;

    if (!userService) throw new Error('UserService not injected');
    if (!jwtService) throw new Error('JwtService not injected');
    if (!emailService) throw new Error('EmailService not injected');
  }
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    // Add your password validation logic here
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      username: user.email,
      sub: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
      phonenumber: user.phonenumber,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      this.logger.log('Starting password reset process for email:', email);

      const user = await this.userService.validateUser(email);
      if (!user) {
        this.logger.warn('User not found for email:', email);
        throw new NotFoundException('User not found');
      }

      const token = crypto.randomBytes(20).toString('hex');
      user.resetPasswordToken = token;
      user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
      await this.userService.update(user._id.toString(), {
        resetPasswordToken: token,
        resetPasswordExpires: user.resetPasswordExpires,
      });

      this.logger.log('Generated reset token for user:', user.email);
      await this.emailService.sendPasswordResetEmail(email, token);
      this.logger.log('Password reset email sent successfully to:', email);
    } catch (error) {
      this.logger.error(
        'Error processing forgot password request:',
        error.message,
      );
      throw error; // Re-throw error after logging
    }
  }
}
