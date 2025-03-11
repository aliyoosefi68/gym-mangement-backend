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
import { MealService } from "../services/meal.service";
import { MealDto } from "../dtos/meal.dto";
import { SwaggerConsumes } from "src/common/enum/swagger-consumes.enum";

@Controller("meal")
@ApiTags("Meal")
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Post()
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  create(@Body() mealDto: MealDto) {
    return this.mealService.create(mealDto);
  }
  @Get("/:id")
  getMeal(@Param("id", ParseIntPipe) id: number) {
    return this.mealService.getMeal(+id);
  }
  @Delete("/:id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.mealService.removeMeal(+id);
  }
}
