import { ApiProperty, PartialType } from "@nestjs/swagger";

export class AddDateDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  planId: number;
}
// export class UpdatePlanDto extends PartialType(PlanDTo) {}
