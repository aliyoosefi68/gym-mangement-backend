import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BasketEntity } from "./Entity/basket.entity";
import { Repository } from "typeorm";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { BasketDto } from "./dto/basket.dto";
import { MembershipPlanService } from "../membership/services/membership-plan.service";
import {
  BadRequestMessage,
  NotFoundMessage,
  PublicMessage,
} from "src/common/enum/message.enum";

@Injectable({ scope: Scope.REQUEST })
export class BasketService {
  constructor(
    @InjectRepository(BasketEntity)
    private basketRepository: Repository<BasketEntity>,
    private planService: MembershipPlanService,
    @Inject(REQUEST) private req: Request
  ) {}

  async addToBasket(basketDto: BasketDto) {
    const { id: userId } = this.req.user;
    const { planId } = basketDto;
    const plan = await this.planService.getOnePlaneById(planId);
    let basketItem = await this.basketRepository.findOne({
      where: {},
    });

    if (basketItem) {
      basketItem.planId = planId;
      await this.basketRepository.save(basketItem);
    } else {
      await this.basketRepository.insert({
        planId,
        userId,
      });
    }

    return {
      message: PublicMessage.AddToBasket,
    };
  }

  async getUserBasket() {
    const { id: userId } = this.req.user;
    const basketItem = await this.basketRepository.findOne({
      relations: { plan: true },
      where: { userId },
    });
    if (!basketItem) throw new NotFoundException(BadRequestMessage.BasketEmpty);
    let paymant_amount = basketItem.plan.price;
    return {
      paymant_amount: +paymant_amount,
      plan: basketItem.plan,
    };
  }
}
