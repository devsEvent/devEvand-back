import {
  Injectable,
  BadRequestException,
  BadGatewayException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterInput } from './dto/register.input';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { OtpService } from '../otp/otp.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private prisma: PrismaService,
    private otpService: OtpService,
    private jwtService: JwtService,
  ) {}
  async register(body: RegisterInput) {
    try {
      const existUser = await this.userService.findOne(body.phoneNumber);
      if (existUser) {
        return new BadRequestException('کاربر موجود میباشد');
      }
      const user = await this.prisma.user.create({
        data: {
          phoneNumber: body.phoneNumber,
          email: body.email,
        },
      });
      return await this.login(user.phoneNumber);
    } catch (error) {
      console.log(error);
      return new BadGatewayException('مشکلی از سمت سرور پیش آمده است');
    }
  }

  async login(phoneNumber: string) {
    try {
      const user = await this.userService.findOne(phoneNumber);
      if (!user)
        new BadRequestException('کاربری با این شماره مبایل موجود نمیباشد');
      const generateCode = Math.floor(Math.random() * 100000).toString();
      const codeExpire = (Date.now() + 1000 * 60 * 2).toString();
      console.log(Date.now());
      console.log(generateCode);
      await this.canSendCode(user);
      const text = `کد ورود به devEvand : ${generateCode}`;
      await this.otpService.sendSingle(user.phoneNumber, text);
      const hashCode = await bcrypt.hash(generateCode, 10);
      console.log(codeExpire);
      await this.prisma.user.update({
        where: { id: user.id },
        data: { code: hashCode, codeExpire },
      });
      return {
        message: 'کد با موفقیت ارسال شد',
        phoneNumber: user.phoneNumber,
      };
    } catch (error) {
      console.log(error);
      return new BadGatewayException('مشکلی از سمت سرور پیش آمده است');
    }
  }

  async checkLoginCode(code: string, phoneNumber: string, rememberMe: boolean) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { phoneNumber },
      });
      if (!user) new BadRequestException('شماره مبایل اشتباه است');
      const verifyCode = await bcrypt.compare(code, user.code);
      if (!verifyCode) new BadRequestException('کد وارد شده صحیح نمی باشد');
      const payload = {
        id: user.id,
        phoneNumber: user.phoneNumber,
        email: user.email,
      };
      const token = await this.generateToken(payload, rememberMe);
      await this.prisma.user.update({
        where: { id: user.id },
        data: { codeExpire: '', code: '', refToken: token.refresh_token },
      });
      return {
        accessToken: token.access_token,
        user: payload,
      };
    } catch (error) {
      console.log(error);
      return new BadGatewayException('مشکلی در اعتبار سنجی کد پیش آمده است');
    }
  }

  async canSendCode(user) {
    try {
      if (user.codeExpire === '') {
        return;
      }
      return new BadRequestException('در حال حاضر امکان ارسال کد به شما نیست');
    } catch (error) {
      console.log(error);
      return new BadRequestException('در حال حاضر امکان ارسال کد به شما نیست');
    }
  }
  async refreshToken(req: Request, reqUser) {
    try {
      if (!req.cookies.refToken)
        return new UnauthorizedException('رفرش توکن موجود نیست');
      const user = await this.prisma.user.findUnique({
        where: { id: reqUser.id },
      });
      const verifyToken = await this.jwtService.verifyAsync(
        req.cookies.refToken,
      );
      if (user.refToken !== req.cookies.refToken || !verifyToken)
        return new UnauthorizedException('رفرش توکن معتبر نیست');
      const token = await this.generateToken(reqUser, false);
      return {
        access_token: token,
        user: reqUser,
      };
    } catch (error) {
      console.log(error);
      return new BadGatewayException('مشکلی از سمت سرور پیش آمده است');
    }
  }

  async generateToken(payload: User, rememberMe: boolean) {
    try {
      if (rememberMe) {
        const access_token = await this.jwtService.sign(payload, {
          secret: process.env.ACC_TOKEN_SECRET,
          expiresIn: '1d',
        });
        const refresh_token = await this.jwtService.sign(payload, {
          expiresIn: '30d',
          secret: process.env.REF_TOKEN_SECRET,
        });
        return {
          access_token,
          refresh_token,
        };
      }
      const access_token = await this.jwtService.sign(payload, {
        secret: process.env.ACC_TOKEN_SECRET,
        expiresIn: '1d',
      });
      return {
        refresh_token: null,
        access_token,
      };
    } catch (error) {
      console.log(error);
      return {
        access_token: null,
        refresh_token: null,
      };
    }
  }

  findAll() {
    return `This action returns all auth`;
  }
}
