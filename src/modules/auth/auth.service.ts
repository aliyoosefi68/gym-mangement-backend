import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user/entity/user.entity";
import { Repository } from "typeorm";
import { CheckOtpDto, RefreshTokenDto, SendOtpDto } from "./dto/auth.dto";
import { mobileValidation } from "src/common/utils/mobile.util";

import { JwtService } from "@nestjs/jwt";
import { randomInt } from "crypto";
import { AuthMessage } from "src/common/enum/message.enum";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService
  ) {}

  async sendOtp(sendOtpDto: SendOtpDto) {
    const { mobile } = sendOtpDto;
    const { phoneNumber } = mobileValidation(mobile);
    let user = await this.userRepository.findOneBy({ mobile: phoneNumber });
    if (!user) {
      user = this.userRepository.create({ mobile: phoneNumber });
      const otpCode = randomInt(10000, 99999);
      user.otp_code = String(otpCode);
      user.otp_expired_in = new Date(new Date().getTime() + 1000 * 60);
      await this.userRepository.save(user);
      return {
        message: "send otp code",
        code: otpCode,
      };
    } else {
      if (user.otp_expired_in >= new Date()) {
        throw new BadRequestException(AuthMessage.TryAgain);
      }
      const otpCode = randomInt(10000, 99999);
      user.otp_code = String(otpCode);
      user.otp_expired_in = new Date(new Date().getTime() + 1000 * 60);
      await this.userRepository.save(user);
      return {
        message: "send otp code",
        code: otpCode,
      };
    }
  }

  async checkOtp(checkOtpDto: CheckOtpDto) {
    const { mobile, code } = checkOtpDto;
    const { phoneNumber } = mobileValidation(mobile);
    let user = await this.userRepository.findOneBy({ mobile: phoneNumber });
    if (!user) throw new NotFoundException(AuthMessage.NotFoundAccount);
    if (user.otp_expired_in < new Date())
      throw new UnauthorizedException(AuthMessage.ExpiredCode);
    if (code === user.otp_code) {
      return this.tokenGenerator(user.id, user.mobile);
    }
    throw new UnauthorizedException("کد ارسال شده صحیح نمییاشد");
  }

  async findOneUser(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(AuthMessage.NotFoundAccount);
    return user;
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    const { userId, phone } = this.verifyRefreshToken(refreshToken);
    if (userId && phone) return this.tokenGenerator(+userId, phone);
    throw new UnauthorizedException(AuthMessage.TryAgain);
  }

  async tokenGenerator(userId: number, phone: string) {
    const accessToken = this.jwtService.sign(
      { userId, phone },
      { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: "1d" }
    );
    const refreshToken = this.jwtService.sign(
      { userId, phone },
      { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: "30d" }
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  verifyRefreshToken(refreshToken: string) {
    try {
      const verified = this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
      if (
        verified?.userId &&
        verified?.phone &&
        !isNaN(parseInt(verified.userId))
      )
        return verified;
      throw new UnauthorizedException(AuthMessage.TryAgain);
    } catch (err) {
      throw new UnauthorizedException(AuthMessage.TryAgain);
    }
  }
  verifyAccessToken(token: string) {
    try {
      const verified = this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
      if (
        verified?.userId &&
        verified?.phone &&
        !isNaN(parseInt(verified.userId))
      )
        return verified;
      throw new UnauthorizedException(AuthMessage.TryAgain);
    } catch (err) {
      throw new UnauthorizedException(AuthMessage.TryAgain);
    }
  }

  async validateAccessToken(token: string) {
    const { userId, phone } = this.verifyAccessToken(token);
    const user = await this.userRepository.findOneBy({
      id: userId,
      mobile: phone,
    });
    if (!user) throw new UnauthorizedException(AuthMessage.LoginAgain);
    return user;
  }
}
