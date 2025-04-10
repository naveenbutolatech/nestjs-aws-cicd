import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { ProductsModule } from './products/products.module';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { UserModule } from './users/user.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // make it available everywhere
    }), // Load environment variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mongodb',
        url: configService.get('MONGODB_URI'),
        database: configService.get('MONGODB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        ssl: true,
      }),
      inject: [ConfigService],
    }),
    EmailModule,
    AuthModule,
    UserModule,
    ProductsModule,

  ],
  controllers: [AppController], 
  providers: [AppService], 
})
export class AppModule {}