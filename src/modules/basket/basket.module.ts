import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MembershipModule } from "../membership/membership.module";
import { AuthModule } from "../auth/auth.module";
import { BasketService } from "./basket.service";
import { BasketController } from "./basket.controller";
import { BasketEntity } from "./Entity/basket.entity";

@Module({
  imports: [
    MembershipModule,
    AuthModule,
    TypeOrmModule.forFeature([BasketEntity]),
  ],
  providers: [BasketService],
  controllers: [BasketController],
  exports: [TypeOrmModule, BasketService],
})
export class BasketModule {}
