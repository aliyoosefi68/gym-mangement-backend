import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FoodService } from "../services/food.service";
import { UploadFileS3 } from "src/common/interceptores/upload-file.interceptor";
import { SwaggerConsumes } from "src/common/enum/swagger-consumes.enum";
import { FoodDto, UpdateFoodDto } from "../dto/food.dto";
import { Pagination } from "src/common/decorator/pagination.decorator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { GetFoodDto } from "../dto/food-category.dto";

@Controller("food")
@ApiTags("Foods")
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Post()
  @UseInterceptors(UploadFileS3("image"))
  @ApiConsumes(SwaggerConsumes.MultipartData)
  create(
    @Body() foodDto: FoodDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: "image/(png|jpg|jpeg|webp)" }),
        ],
      })
    )
    image: Express.Multer.File
  ) {
    return this.foodService.create(foodDto, image);
  }

  @Post("/category")
  @Pagination()
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  findAllByCategory(
    @Body() categoryDto: GetFoodDto,
    @Query() pagination: PaginationDto
  ) {
    return this.foodService.findAllByCategoryId(pagination, categoryDto);
  }

  @Patch(":id")
  @UseInterceptors(UploadFileS3("image"))
  @ApiConsumes(SwaggerConsumes.MultipartData)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateFoodDto: UpdateFoodDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: "image/(png|jpg|jpeg|webp)" }),
        ],
      })
    )
    image: Express.Multer.File
  ) {
    return this.foodService.update(id, updateFoodDto, image);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.foodService.remove(id);
  }
}
