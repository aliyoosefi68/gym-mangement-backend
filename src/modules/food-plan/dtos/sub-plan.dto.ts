import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";

export class SubPlanDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  foodPlanId: number;
}
export class UpdateSubPlanDto extends PartialType(SubPlanDto) {}
