import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MembershipService } from "../services/membership.service";
import { UserAuth } from "src/common/decorator/auth.decorator";

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
}
