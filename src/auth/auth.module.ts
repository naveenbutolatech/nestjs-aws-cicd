// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../users/user.module'; // Use relative path
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    UserModule, // This provides UserService
    EmailModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, // Add AuthService to providers
    JwtStrategy,
  ],
  exports: [
    JwtModule,
    PassportModule, // Export PassportModule if needed elsewhere
    AuthService, // Export AuthService if needed elsewhere
  ],
})
export class AuthModule {}