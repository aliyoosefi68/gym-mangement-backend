import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../user/user.module";
import { FoodModule } from "../food/food.module";
import { FoodPlanEntity } from "./entities/food-plan.entity";
import { SubPlanEntity } from "./entities/sub-plan.entity";
import { MealEntity } from "./entities/meal.entity";
import { MealItemEntity } from "./entities/meal-item.entity";
import { FoodPlanService } from "./services/food-plan.service";
import { SubPlanService } from "./services/subplan.service";
import { MealService } from "./services/meal.service";
import { MealItemService } from "./services/meal-item.service";
import { FoodPlanController } from "./controllers/food-plan.controller";
import { SubPlanController } from "./controllers/sub-plan.controller";
import { FoodService } from "../food/services/food.service";
import { FoodEntity } from "../food/entities/food.entity";
import { MealController } from "./controllers/meal.controller";
import { MealItemController } from "./controllers/meal-item.controller";

@Module({
  imports: [
    UserModule,
    AuthModule,
    FoodModule,
    TypeOrmModule.forFeature([
      FoodPlanEntity,
      SubPlanEntity,
      MealEntity,
      MealItemEntity,
      FoodEntity,
    ]),
  ],
  providers: [FoodPlanService, MealItemService, MealService, SubPlanService],
  controllers: [
    FoodPlanController,
    SubPlanController,
    MealController,
    MealItemController,
  ],
})
export class FoodPlanModule {}
