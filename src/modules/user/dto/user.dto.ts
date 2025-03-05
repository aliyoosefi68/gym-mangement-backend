import { ApiProperty } from "@nestjs/swagger";

export class AddWeightDto {
  @ApiProperty()
  currentWight: number;
}
