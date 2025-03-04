import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfig } from "src/config/typeorm.config";
import { AuthModule } from "./auth/auth.module";
import { MembershipModule } from "./membership/membership.module";
import { BasketModule } from "./basket/basket.module";
import { PaymentModule } from "./payment/payment.module";
import { OrderModule } from "./order/order.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig()),
    AuthModule,
    MembershipModule,
    BasketModule,
    PaymentModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
