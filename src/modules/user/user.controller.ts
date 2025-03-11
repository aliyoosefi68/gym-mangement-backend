import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { AddWeightDto } from "./dto/user.dto";
import { UserAuth } from "src/common/decorator/auth.decorator";
import { SwaggerConsumes } from "src/common/enum/swagger-consumes.enum";
import { UploadFileS3 } from "src/common/interceptores/upload-file.interceptor";
import { ProfileDto } from "./dto/profile.dto";

@Controller("user")
@ApiTags("user")
@UserAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  addweight(@Body() weightDto: AddWeightDto) {
    return this.userService.createWeight(weightDto);
  }

  @Get("/my-weight")
  getWeights() {
    return this.userService.getUserWeightByuser();
  }

  @Post("/profile")
  @UseInterceptors(UploadFileS3("image"))
  @ApiConsumes(SwaggerConsumes.MultipartData)
  createProfile(
    @Body() profileDto: ProfileDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: "image/(png|jpg|jpeg|webp)" }),
        ],
      })
    )
    image: Express.Multer.File
  ) {
    return this.userService.createProfile(profileDto, image);
  }
}
