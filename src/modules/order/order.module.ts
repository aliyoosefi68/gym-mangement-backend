import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderEntity } from "./entity/order.entity";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([OrderEntity])],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
