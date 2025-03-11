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
import { SwaggerConsumes } from "src/common/enum/swagger-consumes.enum";
import { UploadFileS3 } from "src/common/interceptores/upload-file.interceptor";
import { CreateCategoryDto, UpdateCategoryDto } from "../dto/food-category.dto";
import { FoodCategoryService } from "../services/food-category.service";
import { Pagination } from "src/common/decorator/pagination.decorator";
import { PaginationDto } from "src/common/dto/pagination.dto";

@Controller("food-category")
@ApiTags("Food Category")
export class FoodCtegoryController {
  constructor(private readonly foodCategoryService: FoodCategoryService) {}

  @Post()
  @UseInterceptors(UploadFileS3("image"))
  @ApiConsumes(SwaggerConsumes.MultipartData)
  create(
    @Body() createCategoryDto: CreateCategoryDto,
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
    return this.foodCategoryService.create(createCategoryDto, image);
  }

  @Get()
  @Pagination()
  findAll(@Query() pagination: PaginationDto) {
    return this.foodCategoryService.findAll(pagination);
  }

  @Patch(":id")
  @UseInterceptors(UploadFileS3("image"))
  @ApiConsumes(SwaggerConsumes.MultipartData)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
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
    return this.foodCategoryService.update(id, updateCategoryDto, image);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.foodCategoryService.remove(id);
  }
}
