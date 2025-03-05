import { Inject, Injectable, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { Repository } from "typeorm";
import { UserWeightEntity } from "./entity/user-weight.entity";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { AddWeightDto } from "./dto/user.dto";
import { PublicMessage } from "src/common/enum/message.enum";

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserWeightEntity)
    private weightRepository: Repository<UserWeightEntity>,
    @Inject(REQUEST) private req: Request
  ) {}

  async createWeight(weightDto: AddWeightDto) {
    const { id: userId } = this.req.user;
    const { currentWight } = weightDto;

    await this.weightRepository.insert({
      userId,
      currentWight,
    });
    return {
      message: PublicMessage.AddWeight,
    };
  }

  async getUserWeightByuser() {
    const { id: userId } = this.req.user;
    const weights = await this.weightRepository.findBy({ userId });
    return weights;
  }
}
