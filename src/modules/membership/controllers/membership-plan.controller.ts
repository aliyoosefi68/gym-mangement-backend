import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { MembershipPlanService } from "../services/membership-plan.service";
import { PlanDTo } from "../dto/membership-plan.dto";
import { SwaggerConsumes } from "src/common/enum/swagger-consumes.enum";

@Controller("membership-plan")
@ApiTags("Membership Plans")
export class MembershipPlanController {
  constructor(private planServie: MembershipPlanService) {}

  @Post()
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  createPlan(@Body() planDto: PlanDTo) {
    return this.planServie.create(planDto);
  }

  @Get()
  getAllPlans() {
    return this.planServie.getAllPlans();
  }

  @Get("/:name")
  getOnePlaneByName(@Param("name") name: string) {
    return this.planServie.getOnePlaneByName(name);
  }

  @Get(":id")
  getOnePlanById(@Param("id", ParseIntPipe) id: number) {
    return this.planServie.getOnePlaneById(id);
  }

  @Delete("/:id")
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.planServie.removePlan(+id);
  }
}
