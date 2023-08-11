import { InputType, Int, Field } from '@nestjs/graphql';
import { IsString, IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';
@InputType()
export class RegisterInput {
  @IsPhoneNumber('IR', { message: 'فرمت شماره مبایل وارد شده صحیح نمیباشد' })
  @IsNotEmpty({ message: 'شماره مبایل الزامی میباشد' })
  @Field(() => String, { description: 'phone number' })
  phoneNumber: string;

  @IsString({ message: 'نام و نام خانوادگی باید رشته باشد' })
  @IsNotEmpty({ message: 'نام و نام خانوادگی الزامی میباشد' })
  @Field(() => String, { description: 'user fullname' })
  fullName: string;

  @IsEmail()
  @IsNotEmpty({ message: 'ایمیل الزامی میباشد' })
  @Field(() => String, { description: 'user email' })
  email: string;
}
