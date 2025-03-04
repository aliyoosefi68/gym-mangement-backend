import { ApiProperty, PartialType } from "@nestjs/swagger";

export class PlanDTo {
  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  durationInDays: number;
}
export class UpdatePlanDto extends PartialType(PlanDTo) {}
