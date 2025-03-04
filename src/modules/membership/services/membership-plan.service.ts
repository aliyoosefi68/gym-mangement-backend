import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MembershipPlanEntity } from "../entity/membership-plan.entity";
import { Repository } from "typeorm";
import { PlanDTo } from "../dto/membership-plan.dto";
import {
  BadRequestMessage,
  NotFoundMessage,
  PublicMessage,
} from "src/common/enum/message.enum";

@Injectable()
export class MembershipPlanService {
  constructor(
    @InjectRepository(MembershipPlanEntity)
    private planRepository: Repository<MembershipPlanEntity>
  ) {}

  async create(planDto: PlanDTo) {
    let { name, price, durationInDays } = planDto;
    name = name.trim();
    const plan = await this.planRepository.findOneBy({ name });
    if (plan) throw new BadRequestException(BadRequestMessage.ALreadyExistPlan);

    if (!durationInDays || durationInDays <= 0)
      throw new BadRequestException(BadRequestMessage.DurationTime);

    await this.planRepository.insert({ name, price: +price, durationInDays });

    return {
      message: PublicMessage.CreatePlan,
    };
  }

  async getAllPlans() {
    return await this.planRepository.find({
      where: {},
    });
  }

  async getOnePlaneByName(name: string) {
    const plan = await this.planRepository.findOneBy({ name: name.trim() });
    if (!plan) throw new NotFoundException(NotFoundMessage.NotfoundPlan);
    return {
      plan,
    };
  }
  async getOnePlaneById(planId: number) {
    const plan = await this.planRepository.findOneBy({ id: planId });
    if (!plan) throw new NotFoundException(NotFoundMessage.NotfoundPlan);
    return {
      plan,
    };
  }

  async removePlan(id: number) {
    const plan = await this.planRepository.findOneBy({ id });
    if (!plan) throw new NotFoundException(NotFoundMessage.NotfoundPlan);
    await this.planRepository.delete(plan);
    return {
      message: PublicMessage.Deleted,
    };
  }
}
