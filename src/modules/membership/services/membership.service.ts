import { Injectable, Scope, Inject, NotFoundException } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { MembershipEntity } from "../entity/membership.entity";
import { LessThanOrEqual, MoreThan, Repository } from "typeorm";
import { NotFoundMessage, PublicMessage } from "src/common/enum/message.enum";
import { AddDateDto } from "../dto/membership.dto";
import { MembershipPlanEntity } from "../entity/membership-plan.entity";
import { Cron } from "@nestjs/schedule";

@Injectable({ scope: Scope.REQUEST })
export class MembershipService {
  constructor(
    @Inject(REQUEST) private req: Request,
    @InjectRepository(MembershipEntity)
    private membershipRepository: Repository<MembershipEntity>,
    @InjectRepository(MembershipPlanEntity)
    private planRepository: Repository<MembershipPlanEntity>
  ) {}

  async getMyMembership() {
    const { id: userId } = this.req.user;
    const membership = await this.membershipRepository.findOneBy({ userId });
    console.log(membership);
    if (!membership) throw new NotFoundException(NotFoundMessage.Notfound);
    return {
      membership,
    };
  }

  async getAllActivMembership() {
    const currentDate = new Date();
    const memberships = await this.membershipRepository.find({
      where: { endDate: MoreThan(currentDate) },
    });

    return memberships;
  }

  async getMembershipReminder() {
    const endMembership = new Date();
    endMembership.setDate(endMembership.getDate() + 3);
    const expiringMemberships = await this.membershipRepository.find({
      where: { endDate: LessThanOrEqual(endMembership) },
      relations: ["user"],
    });

    return expiringMemberships;
  }

  async addDateToUserMembership(addDateDto: AddDateDto) {
    const { userId, planId } = addDateDto;

    const currentDate = new Date();
    let membership = await this.membershipRepository.findOneBy({ userId });
    const plan = await this.planRepository.findOneBy({ id: planId });
    if (!plan) throw new NotFoundException(NotFoundMessage.NotfoundPlan);
    if (!membership) {
      membership = this.membershipRepository.create({
        userId,
        planId,
        startDate: currentDate,
        endDate: new Date(
          currentDate.getTime() + plan.durationInDays * 24 * 60 * 60 * 1000
        ),
      });
      await Promise.all([
        this.membershipRepository.save(membership),
        this.planRepository.save(plan),
      ]);
      return {
        messagge: PublicMessage.CreateMemberShip,
      };
    }
    if (membership.endDate < currentDate) {
      membership.startDate = currentDate;
      membership.endDate = new Date(
        currentDate.getTime() + plan.durationInDays * 24 * 60 * 60 * 1000
      );
    } else {
      let oldEndDate = membership.endDate;
      membership.endDate = new Date(
        oldEndDate.getTime() + plan.durationInDays * 24 * 60 * 60 * 1000
      );
    }
    await this.membershipRepository.save(membership);
    return {
      messagge: PublicMessage.CreateMemberShip,
    };
  }
}
