import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsPhoneNumber, IsNotEmpty, IsBoolean } from 'class-validator';

@InputType()
export class CheckCode {
  @IsNotEmpty({ message: 'کد ارسال شده الزامی میباشد' })
  @Field(() => String)
  code: string;

  @IsPhoneNumber('IR', { message: 'فرمت شماره مبایل صحیح نمیباشد' })
  @IsNotEmpty({ message: 'شماره مبایل الزامی میباشد' })
  @Field((returns) => String)
  phoneNumber: string;

  @IsNotEmpty({ message: 'من را بخاطر بسپار الزامی میباشد' })
  @IsBoolean({ message: 'من را بخاطر بسپار باید بولین باشد' })
  @Field((returns) => Boolean)
  rememberMe: boolean;
}
