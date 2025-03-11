import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";

export class FoodPlanDto {
  @ApiProperty()
  userId: number;

  @ApiPropertyOptional()
  duration: number;
  @ApiPropertyOptional()
  startDate: Date;
  @ApiPropertyOptional()
  endDate: Date;
}
export class UpdatePlanDto extends PartialType(FoodPlanDto) {}
