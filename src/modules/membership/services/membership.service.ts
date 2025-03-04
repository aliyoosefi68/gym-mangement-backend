import { Injectable, Scope, Inject, NotFoundException } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { MembershipEntity } from "../entity/membership.entity";
import { MoreThan, Repository } from "typeorm";
import { NotFoundMessage } from "src/common/enum/message.enum";

@Injectable({ scope: Scope.REQUEST })
export class MembershipService {
  constructor(
    @Inject(REQUEST) private req: Request,
    @InjectRepository(MembershipEntity)
    private membershipRepository: Repository<MembershipEntity>
  ) {}

  async getMyMembership() {
    const { id: userId } = this.req.user;
    const membership = await this.membershipRepository.findOneBy({ userId });
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
}
