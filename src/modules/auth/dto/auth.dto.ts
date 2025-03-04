import { ApiProperty } from "@nestjs/swagger";
import { IsJWT, IsMobilePhone, Length } from "class-validator";

export class SignupDto {
  @ApiProperty()
  @Length(3, 50, { message: "نام باید بین 3 الی 50 کارکتر باشد" })
  firstname: string;

  @ApiProperty()
  @Length(3, 50, { message: "نام خانوادگی باید بین ۳ الی ۵۰ کاراکتر باشد" })
  lastname: string;

  @ApiProperty()
  @IsMobilePhone("fa-IR", {}, { message: "شماره وارد شده صحیح نمیباشد" })
  mobile: string;
}
export class LoginDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
}
export class SendOtpDto {
  @ApiProperty()
  @IsMobilePhone("fa-IR", {}, { message: "شماره وارد شده صحیح نمیباشد" })
  mobile: string;
}
export class CheckOtpDto {
  @ApiProperty()
  @IsMobilePhone("fa-IR", {}, { message: "شماره وارد شده صحیح نمیباشد" })
  mobile: string;
  @ApiProperty()
  @Length(5, 5, { message: "رمز یکبار مصرف باید ۵ کاراکتر باشد" })
  code: string;
}
export class RefreshTokenDto {
  @ApiProperty()
  @IsJWT({ message: "توکن ارسال شده صحیح نمیباشد" })
  refreshToken: string;
}
export class ForgetPasswordDto {}
