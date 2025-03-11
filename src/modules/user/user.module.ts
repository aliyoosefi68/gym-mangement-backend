import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { UserWeightEntity } from "./entity/user-weight.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { AuthModule } from "../auth/auth.module";
import { S3Service } from "../s3/s3.service";
import { ProfileEntity } from "./entity/profile.entity";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([UserEntity, UserWeightEntity, ProfileEntity]),
  ],
  providers: [UserService, S3Service],
  controllers: [UserController],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
