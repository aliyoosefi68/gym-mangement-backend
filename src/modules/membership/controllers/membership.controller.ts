import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { MembershipService } from "../services/membership.service";
import { UserAuth } from "src/common/decorator/auth.decorator";
import { SwaggerConsumes } from "src/common/enum/swagger-consumes.enum";
import { AddDateDto } from "../dto/membership.dto";

@Controller("membership")
@ApiTags("Membership")
@UserAuth()
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Get("/my-membership")
  getMyMembership() {
    return this.membershipService.getMyMembership();
  }
  @Get("/all-active-memberships")
  getAllActivMembership() {
    return this.membershipService.getAllActivMembership();
  }

  @Get("/3days-to-expire")
  threeDaysToExpire() {
    return this.membershipService.getMembershipReminder();
  }

  @Post("/add-date")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  addDateToUserMembership(@Body() addDateDto: AddDateDto) {
    return this.membershipService.addDateToUserMembership(addDateDto);
  }
}
