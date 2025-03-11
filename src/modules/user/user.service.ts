import { Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { Repository } from "typeorm";
import { UserWeightEntity } from "./entity/user-weight.entity";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { AddWeightDto } from "./dto/user.dto";
import { NotFoundMessage, PublicMessage } from "src/common/enum/message.enum";
import { ProfileDto } from "./dto/profile.dto";
import { S3Service } from "../s3/s3.service";
import { ProfileEntity } from "./entity/profile.entity";

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserWeightEntity)
    private weightRepository: Repository<UserWeightEntity>,
    @Inject(REQUEST) private req: Request,
    private s3Service: S3Service
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

  async createProfile(profileDto: ProfileDto, image: Express.Multer.File) {
    const { Location, Key } = await this.s3Service.uploadFile(
      image,
      "gym-image"
    );
    const { id: userId } = this.req.user;
    let { firstname, lastname, gender, email, birthday } = profileDto;

    let profile = this.profileRepository.create({
      firstname,
      lastname,
      birthday,
      gender,
      userId,
      imageKey: Key,
      imageUrl: Location,
    });
    profile = await this.profileRepository.save(profile);
    let user = await this.userRepository.findOneBy({ id: userId });
    user.profileId = profile.id;
    await this.userRepository.save(user);
    return {
      message: PublicMessage.Updated,
    };
  }

  async findUserById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(NotFoundMessage.NotfoundUser);
    return user;
  }
}
