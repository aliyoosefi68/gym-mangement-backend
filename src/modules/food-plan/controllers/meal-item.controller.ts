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
import { MealItemService } from "../services/meal-item.service";
import { MealItemDto } from "../dtos/meal-item.dto";
import { SwaggerConsumes } from "src/common/enum/swagger-consumes.enum";

@Controller("meal-item")
@ApiTags("Meal Item")
export class MealItemController {
  constructor(private readonly itemService: MealItemService) {}

  @Post()
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  addToMeal(@Body() addDto: MealItemDto) {
    return this.itemService.addToMeal(addDto);
  }

  @Get("/:id")
  getItem(@Param("id", ParseIntPipe) id: number) {
    return this.itemService.getItemById(id);
  }
  @Delete("/:id")
  removeItem(@Param("id", ParseIntPipe) id: number) {
    return this.itemService.removeItem(id);
  }
}
