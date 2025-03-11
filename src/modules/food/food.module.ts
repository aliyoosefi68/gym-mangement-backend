import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FoodEntity } from "./entities/food.entity";
import { FoodCategoryEntity } from "./entities/food-category.entity";
import { S3Service } from "../s3/s3.service";
import { FoodCategoryService } from "./services/food-category.service";
import { FoodCtegoryController } from "./controllers/food-category.controller";
import { FoodService } from "./services/food.service";
import { FoodController } from "./controllers/food.controller";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([FoodEntity, FoodCategoryEntity]),
  ],
  providers: [S3Service, FoodCategoryService, FoodService],
  controllers: [FoodCtegoryController, FoodController],
  exports: [FoodService, TypeOrmModule],
})
export class FoodModule {}
