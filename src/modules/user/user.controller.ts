import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { AddWeightDto } from "./dto/user.dto";
import { UserAuth } from "src/common/decorator/auth.decorator";
import { SwaggerConsumes } from "src/common/enum/swagger-consumes.enum";

@Controller("user")
@ApiTags("user")
@UserAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  addweight(@Body() weightDto: AddWeightDto) {
    return this.userService.createWeight(weightDto);
  }

  @Get("/my-weight")
  getWeights() {
    return this.userService.getUserWeightByuser();
  }
}
