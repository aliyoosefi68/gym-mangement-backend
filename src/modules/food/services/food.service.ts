import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FoodEntity } from "../entities/food.entity";
import { DeepPartial, Repository } from "typeorm";
import { S3Service } from "src/modules/s3/s3.service";
import { FoodDto, UpdateFoodDto } from "../dto/food.dto";
import {
  ConflictMessage,
  NotFoundMessage,
  PublicMessage,
} from "src/common/enum/message.enum";
import { PaginationDto } from "src/common/dto/pagination.dto";
import {
  paginationGenerator,
  paginationSolver,
} from "src/common/utils/pagination.util";
import { FoodCategoryService } from "./food-category.service";
import { GetFoodDto } from "../dto/food-category.dto";

@Injectable()
export class FoodService {
  constructor(
    @InjectRepository(FoodEntity)
    private foodRepository: Repository<FoodEntity>,
    private s3Service: S3Service,
    private categoryService: FoodCategoryService
  ) {}

  async create(foodDto: FoodDto, image: Express.Multer.File) {
    const { Location, Key } = await this.s3Service.uploadFile(
      image,
      "gym-image"
    );
    let { title, recipe, sugar, fat, kaleri, protoen, categoryId } = foodDto;
    title = title.trim();
    let food = await this.foodRepository.findOneBy({ title });
    if (food) throw new ConflictException(ConflictMessage.Food);
    await this.foodRepository.insert({
      title,
      recipe,
      sugar,
      fat,
      kaleri,
      protoen,
      categoryId: +categoryId,
      imageUrl: Location,
      imageKey: Key,
    });
    return {
      message: PublicMessage.Created,
    };
  }

  async findAllByCategoryId(
    paginationDto: PaginationDto,
    getfoodDto: GetFoodDto
  ) {
    const { limit, page, skip } = paginationSolver(
      paginationDto.page,
      paginationDto.limit
    );
    const [foods, count] = await this.foodRepository.findAndCount({
      where: { categoryId: getfoodDto.categoryId },
      skip,
      take: limit,
      order: { id: "DESC" },
    });
    return {
      pagination: paginationGenerator(count, page, limit),
      foods,
    };
  }
  async findOneById(id: number) {
    const food = await this.foodRepository.findOneBy({ id });
    if (!food) throw new NotFoundException(NotFoundMessage.Notfound);
    return food;
  }

  async update(
    id: number,
    updateFoodDto: UpdateFoodDto,
    image: Express.Multer.File
  ) {
    const { sugar, fat, kaleri, protoen, recipe, categoryId, title } =
      updateFoodDto;
    const food = await this.findOneById(id);
    const updateObject: DeepPartial<FoodEntity> = {};
    if (image) {
      const { Location, Key } = await this.s3Service.uploadFile(
        image,
        "gym-image"
      );
      if (Location) {
        updateObject["imageUrl"] = Location;
        updateObject["imageKey"] = Key;
        if (food?.imageKey) await this.s3Service.deleteFile(food?.imageKey);
      }
    }
    if (title) updateObject["title"] = title;
    if (fat) updateObject["fat"] = fat;
    if (kaleri) updateObject["kaleri"] = kaleri;
    if (protoen) updateObject["protoen"] = protoen;
    if (recipe) updateObject["recipe"] = recipe;
    if (sugar) updateObject["sugar"] = sugar;

    if (categoryId) {
      const category = await this.categoryService.findOneById(+categoryId);
      updateObject["categoryId"] = +categoryId;
    }

    await this.foodRepository.update({ id }, updateObject);
    return {
      message: PublicMessage.Updated,
    };
  }

  async remove(id: number) {
    const food = await this.findOneById(id);
    await this.foodRepository.delete({ id });
    return {
      message: PublicMessage.Deleted,
    };
  }
}
