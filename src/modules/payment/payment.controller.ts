import { Body, Controller, Get, Post, Query, Res } from "@nestjs/common";
import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { PaymentService } from "./payment.service";
import { UserAuth } from "src/common/decorator/auth.decorator";

class AddressDto {
  @ApiProperty()
  address: string;
}

@Controller("payment")
@ApiTags("Payment")
@UserAuth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  @Get()
  create() {
    return this.paymentService.create();
  }
  @Get("/")
  find() {
    return this.paymentService.find();
  }
  @Get("/verify")
  async verify(
    @Query("Authority") authority: string,
    @Query("Status") status: string,
    @Res() res: Response
  ) {
    const url = await this.paymentService.verify(authority, status);
    return res.redirect(url);
  }
}
