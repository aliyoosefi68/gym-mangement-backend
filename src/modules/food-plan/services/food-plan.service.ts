import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThanOrEqual, Repository } from "typeorm";

import {
  BadRequestMessage,
  NotFoundMessage,
  PublicMessage,
} from "src/common/enum/message.enum";
import { FoodPlanEntity } from "../entities/food-plan.entity";
import { UserService } from "src/modules/user/user.service";
import { FoodPlanDto } from "../dtos/food-plan.dto";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";

@Injectable({ scope: Scope.REQUEST })
export class FoodPlanService {
  constructor(
    @InjectRepository(FoodPlanEntity)
    private planRepository: Repository<FoodPlanEntity>,
    @Inject(REQUEST) private req: Request,
    private userService: UserService
  ) {}

  async create(planDto: FoodPlanDto) {
    let { userId, duration, endDate, startDate } = planDto;
    if (startDate) startDate = new Date(startDate);
    if (endDate) endDate = new Date(endDate);
    const user = await this.userService.findUserById(+userId);
    if (!duration && !endDate && !startDate)
      throw new BadRequestException(BadRequestMessage.FoodPlanEnterTime);

    if (duration && startDate && endDate) {
      if (
        endDate !==
        new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000)
      ) {
        throw new BadRequestException(
          "تاریخ پایان دوره با طول دوره همخوانی ندارد."
        );
      }
      if (endDate < startDate)
        throw new BadRequestException(
          "تاریخ پایان رژیم باید از تاریخ شروع رژیم بیشتر باشد"
        );
    }

    if (!duration && !startDate && endDate) startDate = new Date();
    if (duration && startDate && !endDate) {
      endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);
    }
    await this.planRepository.insert({
      userId,
      duration,
      startDate,
      endDate,
    });

    return {
      message: PublicMessage.CreatedFoodPlan,
    };
  }

  async findPlanByUserId(userId: number) {
    const plan = await this.planRepository.findOneBy({ userId });
    if (!plan) throw new NotFoundException(NotFoundMessage.Notfound);
    return plan;
  }
  async findPlanById(id: number) {
    const plan = await this.planRepository.findOneBy({ id });
    if (!plan) throw new NotFoundException(NotFoundMessage.Notfound);
    return plan;
  }

  async setStartDate() {
    const { id: userId } = this.req.user;
    const plan = await this.planRepository.findOne({
      where: { userId, startDate: null },
    });
    if (!plan) throw new NotFoundException(NotFoundMessage.NotfoundPlan);
    plan.startDate = new Date();

    await this.planRepository.save(plan);
    return {
      message: PublicMessage.SetStartDate,
    };
  }
  async myAllPlans() {
    const { id: userId } = this.req.user;
    const plans = await this.planRepository.find({
      where: { userId },
    });
    return plans;
  }
  async findMyActivePlan() {
    const { id: userId } = this.req.user;
    const plan = await this.planRepository.findOne({
      where: { userId, endDate: MoreThanOrEqual(new Date()) },
    });
    if (!plan) throw new NotFoundException(NotFoundMessage.NotfoundPlan);
    return plan;
  }
  async findUserActivePlan(userId: number) {
    const plan = await this.planRepository.findOne({
      where: { userId, endDate: MoreThanOrEqual(new Date()) },
    });
    if (!plan) throw new NotFoundException(NotFoundMessage.NotfoundPlan);
    return plan;
  }
  async removePlan(id: number) {
    let plan = await this.planRepository.findOneBy({ id });

    if (!plan) {
      throw new NotFoundException(NotFoundMessage.NotfoundPlan);
    }
    if (plan) await this.planRepository.delete({ id });
    return {
      message: PublicMessage.Deleted,
    };
  }
}
