import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  //   canActivate(context: ExecutionContext) {
  //     const ctx = GqlExecutionContext.create(context);
  //     const { req } = ctx.getContext();

  //     return super.canActivate(new ExecutionContextHost([req]));
  //   }

  handleRequest(err: any, user: any, info, context) {
    if (err || !user) {
      throw new UnauthorizedException('ورود اشتباه');
    }
    return user;
  }
  getRequest(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const request = gqlCtx.getContext().req;
    return request;
  }
}
