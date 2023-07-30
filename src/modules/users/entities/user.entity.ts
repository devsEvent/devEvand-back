import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field((returns) => String)
  phoneNumber: string;

  @Field((returns) => String)
  email: string;
}
