import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MembershipEntity } from "./entity/membership.entity";
import { MembershipPlanEntity } from "./entity/membership-plan.entity";
import { MembershipPlanService } from "./services/membership-plan.service";
import { MembershipPlanController } from "./controllers/membership-plan.controller";
import { MembershipController } from "./controllers/membership.controller";
import { MembershipService } from "./services/membership.service";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([MembershipEntity, MembershipPlanEntity]),
  ],
  providers: [MembershipPlanService, MembershipService],
  controllers: [MembershipPlanController, MembershipController],
  exports: [TypeOrmModule, MembershipPlanService],
})
export class MembershipModule {}
