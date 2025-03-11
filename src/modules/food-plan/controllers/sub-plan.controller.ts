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
import { UserAuth } from "src/common/decorator/auth.decorator";
import { SubPlanService } from "../services/subplan.service";
import { SwaggerConsumes } from "src/common/enum/swagger-consumes.enum";
import { SubPlanDto } from "../dtos/sub-plan.dto";

@Controller("sub-plan")
@ApiTags("Sub Plans Of Food")
@UserAuth()
export class SubPlanController {
  constructor(private readonly subplanService: SubPlanService) {}

  @Post()
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  create(@Body() subDto: SubPlanDto) {
    return this.subplanService.createSubPlan(subDto);
  }

  @Get("/by-id/:id")
  findSubPlanById(@Param("id", ParseIntPipe) id: number) {
    return this.subplanService.getSubPlanById(+id);
  }

  @Delete("/:id")
  removeSubplan(@Param("id", ParseIntPipe) id: number) {
    return this.removeSubplan(+id);
  }
}
