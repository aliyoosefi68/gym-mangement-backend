import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BasketService } from "../basket/basket.service";
import { BasketEntity } from "../basket/entity/basket.entity";

import { HttpApiModule } from "../http/http.module";
import { OrderItemsEntity } from "../order/entity/order-items.entity";
import { OrderEntity } from "../order/entity/order.entity";

import { PaymentEntity } from "./entity/payment.entity";

import { PaymentService } from "./payment.service";
import { MembershipEntity } from "../membership/entity/membership.entity";
import { MembershipPlanEntity } from "../membership/entity/membership-plan.entity";
import { MembershipPlanService } from "../membership/services/membership-plan.service";
import { PaymentController } from "./payment.controller";
import { AuthModule } from "../auth/auth.module";
import { BasketModule } from "../basket/basket.module";

@Module({
  imports: [
    HttpApiModule,
    AuthModule,
    BasketModule,
    TypeOrmModule.forFeature([
      PaymentEntity,
      OrderEntity,
      OrderItemsEntity,
      MembershipEntity,
      MembershipPlanEntity,
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, MembershipPlanService],
  exports: [],
})
export class PaymentModule {}
