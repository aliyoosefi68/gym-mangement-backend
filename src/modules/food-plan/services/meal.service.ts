import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MealEntity } from "../entities/meal.entity";
import { Repository } from "typeorm";
import { MealDto } from "../dtos/meal.dto";
import { SubPlanService } from "./subplan.service";
import {
  ConflictMessage,
  NotFoundMessage,
  PublicMessage,
} from "src/common/enum/message.enum";
import { MealItemService } from "./meal-item.service";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { SubPlanEntity } from "../entities/sub-plan.entity";

@Injectable({ scope: Scope.REQUEST })
export class MealService {
  constructor(
    @InjectRepository(MealEntity)
    private mealRepository: Repository<MealEntity>,
    @InjectRepository(SubPlanEntity)
    private subRepository: Repository<SubPlanEntity>,

    private itemService: MealItemService,
    @Inject(REQUEST) private req: Request
  ) {}

  async create(mealDto: MealDto) {
    let { title, subplanId } = mealDto;
    const subplan = await this.subRepository.findOneBy({ id: subplanId });
    if (!subplan) throw new NotFoundException(NotFoundMessage.NotFoundSubPlan);
    title = title.trim();
    const existMeal = await this.mealRepository.findOneBy({ title, subplanId });
    if (existMeal) throw new ConflictException(ConflictMessage.Meal);
    await this.mealRepository.insert({ title, subplanId });
    return {
      message: PublicMessage.CreateMeal,
    };
  }

  async findMealById(id: number) {
    const meal = await this.mealRepository.findOneBy({ id });
    if (!meal) throw new NotFoundException(NotFoundMessage.NotfoundMeal);
    return meal;
  }
  async findMealBySubPlanId(id: number) {
    const meals = await this.mealRepository.find({
      where: { subplanId: id },
    });
    if (meals.length < 1)
      throw new NotFoundException(NotFoundMessage.NotfoundMeal);
    return meals;
  }
  async getMeal(mealId: number) {
    const meal = await this.mealRepository.findOneBy({ id: mealId });
    if (!meal) throw new NotFoundException(NotFoundMessage.NotfoundMeal);
    return await this.itemService.getItemsOfMeal(mealId);
  }

  async removeMeal(mealId: number) {
    const meal = await this.findMealById(mealId);
    await this.mealRepository.delete({ id: mealId });
    return { message: PublicMessage.Deleted };
  }
}
