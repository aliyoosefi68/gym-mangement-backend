import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Gender } from "../enum/profile.enum";

export class ProfileDto {
  @ApiProperty()
  firstname: string;
  @ApiProperty()
  lastname: string;
  @ApiPropertyOptional({ format: "binary" })
  image: string;

  @ApiProperty({ enum: Gender })
  gender: string;
  @ApiProperty()
  birthday: Date;
  @ApiProperty()
  email: string;
}

export class UpdateProfileDto extends PartialType(ProfileDto) {}
