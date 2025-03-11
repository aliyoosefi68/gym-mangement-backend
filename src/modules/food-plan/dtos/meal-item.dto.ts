import { ApiProperty } from "@nestjs/swagger";

export class MealItemDto {
  @ApiProperty()
  foodId: number;
  @ApiProperty()
  mealId: number;
  @ApiProperty()
  count: number;
}
export class RemoveMealItemDto {
  @ApiProperty()
  foodId: number;
  @ApiProperty()
  mealId: number;
}
