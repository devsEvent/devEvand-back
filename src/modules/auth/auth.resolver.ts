import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { RegisterInput } from './dto/register.input';
import { CheckCode } from './dto/login.input';
import { LoginResult } from './dto/loginResult.dto';
import { CheckCodeResult } from './dto/checkLoginCodeResult.dto';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guard/gql-auth.guard';
import { GetCurrentUser } from 'src/common/get-current-user-id.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResult)
  register(@Args('body') body: RegisterInput, @GetCurrentUser() user) {
    if (user) return new BadRequestException('شما وارد سایت شده اید');
    return this.authService.register(body);
  }

  @Mutation(() => LoginResult)
  login(@Args('phoneNumber') phoneNumber: string, @GetCurrentUser() user) {
    if (user) return new BadRequestException('شما وارد سایت شده اید');
    return this.authService.login(phoneNumber);
  }

  @Mutation(() => CheckCodeResult)
  checkCode(@Args('body') body: CheckCode, @GetCurrentUser() user) {
    if (user) return new BadRequestException('شما وارد سایت شده اید');
    return this.authService.checkLoginCode(
      body.code,
      body.phoneNumber,
      body.rememberMe,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Auth)
  refreshToken(@Context('req') req: Request, @GetCurrentUser() user) {
    return this.authService.refreshToken(req, user);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User, { name: 'auth' })
  findAll(@GetCurrentUser() user) {
    return user;
  }
}
