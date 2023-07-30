import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class RegisterInput {
  @Field(() => String, { description: 'phone number' })
  phoneNumber: string;

  @Field(() => String, { description: 'user fullname' })
  fullName: string;

  @Field(() => String, { description: 'user email' })
  email: string;
}
