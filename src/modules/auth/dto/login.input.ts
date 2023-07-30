import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class CheckCode {
  @Field(() => String)
  code: string;

  @Field((returns) => String)
  phoneNumber: string;

  @Field((returns) => Boolean)
  rememberMe: boolean;
}
