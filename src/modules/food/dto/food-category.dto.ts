import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";

export class CreateCategoryDto {
  @ApiProperty()
  title: string;
  @ApiPropertyOptional({ nullable: true })
  slug: string;
  @ApiProperty({ format: "binary" })
  image: string;
}
export class GetFoodDto {
  @ApiProperty()
  categoryId: number;
}
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
