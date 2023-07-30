import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersService } from '../users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { OtpService } from '../otp/otp.service';
import { OtpModule } from '../otp/otp.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [
    AuthResolver,
    AuthService,
    JwtStrategy,
    UsersService,
    OtpService,
    PrismaService,
  ],
  imports: [
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
})
export class AuthModule {}
