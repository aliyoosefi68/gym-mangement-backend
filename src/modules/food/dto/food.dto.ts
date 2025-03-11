import { ApiProperty, PartialType } from "@nestjs/swagger";

export class FoodDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  recipe: string;
  @ApiProperty()
  fat: number;
  @ApiProperty()
  kaleri: number;
  @ApiProperty()
  protoen: number;
  @ApiProperty()
  sugar: number;
  @ApiProperty()
  categoryId: number;
  @ApiProperty({ format: "binary" })
  image: string;
}
export class UpdateFoodDto extends PartialType(FoodDto) {}
