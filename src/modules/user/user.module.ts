import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { UserWeightEntity } from "./entity/user-weight.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([UserEntity, UserWeightEntity]),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
