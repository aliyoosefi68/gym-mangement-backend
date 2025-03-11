import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { MealType } from "../enum/meal.enum";

export class MealDto {
  @ApiProperty({ enum: MealType })
  title: string;
  @ApiProperty()
  subplanId: number;
  @ApiPropertyOptional()
  fat: number;
  @ApiPropertyOptional()
  kaleri: number;
  @ApiPropertyOptional()
  protoen: number;
  @ApiPropertyOptional()
  sugar: number;
}
