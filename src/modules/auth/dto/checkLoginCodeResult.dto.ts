import {
  InputType,
  Field,
  Int,
  PartialType,
  ObjectType,
} from '@nestjs/graphql';
import { User } from 'src/modules/users/entities/user.entity';

@ObjectType()
export class CheckCodeResult {
  @Field(() => String)
  accessToken: string;

  @Field((returns) => User)
  user: User;
}
