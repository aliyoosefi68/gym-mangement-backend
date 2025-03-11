import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SubPlanEntity } from "../entities/sub-plan.entity";
import { Repository } from "typeorm";
import { Request } from "express";
import { REQUEST } from "@nestjs/core";
import { SubPlanDto } from "../dtos/sub-plan.dto";
import { FoodPlanService } from "./food-plan.service";
import {
  BadRequestMessage,
  ConflictMessage,
  NotFoundMessage,
  PublicMessage,
} from "src/common/enum/message.enum";
import { MealService } from "./meal.service";

@Injectable({ scope: Scope.REQUEST })
export class SubPlanService {
  constructor(
    @InjectRepository(SubPlanEntity)
    private subplanRepository: Repository<SubPlanEntity>,
    private planService: FoodPlanService,
    @Inject(REQUEST) private req: Request,
    private mealService: MealService
  ) {}

  async createSubPlan(subDto: SubPlanDto) {
    let { title, foodPlanId } = subDto;
    const plan = await this.planService.findPlanById(foodPlanId);
    if (plan.endDate < new Date())
      throw new BadRequestException(BadRequestMessage.ExpiredPlan);
    const subplan = await this.subplanRepository.findOneBy({
      title,
      foodPlanId,
    });
    if (subplan) throw new ConflictException(ConflictMessage.SubPlan);
    await this.subplanRepository.insert({ title, foodPlanId });
    return { message: PublicMessage.CreatedSubPlan };
  }

  async findSubPlanById(id: number) {
    const subplan = await this.subplanRepository.findOneBy({ id });
    if (!subplan) throw new NotFoundException(NotFoundMessage.NotFoundSubPlan);
    return subplan;
  }

  async getSubPlanById(id: number) {
    const mealsData = [];
    let subKaleri = 0;
    let subProtoen = 0;
    let subFat = 0;
    let subSugar = 0;
    const subplan = await this.findSubPlanById(id);
    const meals = await this.mealService.findMealBySubPlanId(id);
    for (const item of meals) {
      const { id, title } = item;
      const meal = await this.mealService.getMeal(id);
      subKaleri += meal.kaleri;
      subFat += meal.fat;
      subProtoen += meal.protoien;
      subSugar += meal.sugar;
      mealsData.push({ meal: title, items: meal.items });
    }
    return {
      kaleri: subKaleri,
      protoen: subProtoen,
      fat: subFat,
      sugar: subSugar,
      mealsData,
    };
  }

  async findSubPlanByTitle(title: string) {
    const subplan = await this.subplanRepository.findOneBy({ title });
    if (!subplan) throw new NotFoundException(NotFoundMessage.NotFoundSubPlan);
    return subplan;
  }
  async removeSubplan(id: number) {
    const plan = await this.findSubPlanById(id);
    await this.subplanRepository.delete(plan);
    return { message: PublicMessage.Deleted };
  }
}
