import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FoodPlanService } from "../services/food-plan.service";

import { SwaggerConsumes } from "src/common/enum/swagger-consumes.enum";
import { FoodPlanDto } from "../dtos/food-plan.dto";
import { UserAuth } from "src/common/decorator/auth.decorator";

@Controller("food-plan")
@ApiTags("food-plan")
@UserAuth()
export class FoodPlanController {
  constructor(private readonly planService: FoodPlanService) {}

  @Post()
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  create(@Body() planDto: FoodPlanDto) {
    return this.planService.create(planDto);
  }

  @Get("user/:id")
  findPlanByUserId(@Param("id", ParseIntPipe) id: number) {
    return this.planService.findPlanByUserId(id);
  }
  @Get("user-active-plan/:id")
  findUserActivePlan(@Param("id", ParseIntPipe) id: number) {
    return this.planService.findUserActivePlan(id);
  }
  @Get("my-plan")
  findMyActivePlan() {
    return this.planService.findMyActivePlan();
  }
  @Get("my-all-plan")
  myAllPlans() {
    return this.planService.myAllPlans();
  }

  @Patch("start-date")
  setStartDate() {
    return this.planService.setStartDate();
  }

  @Delete("/:id")
  removePlan(@Param("id", ParseIntPipe) id: number) {
    return this.planService.removePlan(+id);
  }
}
