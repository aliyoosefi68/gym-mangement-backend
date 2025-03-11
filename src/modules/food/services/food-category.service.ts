import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FoodCategoryEntity } from "../entities/food-category.entity";
import { DeepPartial, Repository } from "typeorm";
import { CreateCategoryDto, UpdateCategoryDto } from "../dto/food-category.dto";
import { S3Service } from "src/modules/s3/s3.service";
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

@Injectable()
export class FoodCategoryService {
  constructor(
    @InjectRepository(FoodCategoryEntity)
    private categoryRepository: Repository<FoodCategoryEntity>,
    private s3Service: S3Service
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    image: Express.Multer.File
  ) {
    const { Location, Key } = await this.s3Service.uploadFile(
      image,
      "gym-image"
    );

    let { title, slug } = createCategoryDto;
    const category = await this.findOneBySlug(slug);
    if (category) throw new ConflictException(ConflictMessage.CategoryTitle);

    await this.categoryRepository.insert({
      title,
      slug,
      imageUrl: Location,
      imageKey: Key,
    });
    return {
      message: PublicMessage.Created,
    };
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(
      paginationDto.page,
      paginationDto.limit
    );
    const [categories, count] = await this.categoryRepository.findAndCount({
      where: {},
      skip,
      take: limit,
      order: { id: "DESC" },
    });
    return {
      pagination: paginationGenerator(count, page, limit),
      categories,
    };
  }

  async findOneById(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category)
      throw new NotFoundException(NotFoundMessage.NotfoundCategory);
    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    image: Express.Multer.File
  ) {
    const { slug, title } = updateCategoryDto;
    const category = await this.findOneById(id);
    const updateObject: DeepPartial<FoodCategoryEntity> = {};
    if (image) {
      const { Location, Key } = await this.s3Service.uploadFile(
        image,
        "snappfood-image"
      );
      if (Location) {
        updateObject["imageUrl"] = Location;
        updateObject["imageKey"] = Key;
        if (category?.imageKey)
          await this.s3Service.deleteFile(category?.imageKey);
      }
    }
    if (title) updateObject["title"] = title;

    if (slug) {
      const category = await this.categoryRepository.findOneBy({ slug });
      if (category && category.id !== id)
        throw new ConflictException(ConflictMessage.CategoryTitle);
      updateObject["slug"] = slug;
    }

    await this.categoryRepository.update({ id }, updateObject);
    return {
      message: PublicMessage.Updated,
    };
  }

  async remove(id: number) {
    const category = await this.findOneById(id);
    await this.categoryRepository.delete({ id });
    return {
      message: PublicMessage.Deleted,
    };
  }

  async findOneBySlug(slug: string) {
    return await this.categoryRepository.findOneBy({ slug });
  }
}
