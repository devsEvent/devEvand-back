import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class LoginResult {
  @Field((returns) => String)
  message: string;

  @Field((returns) => String)
  phoneNumber: string;
}
