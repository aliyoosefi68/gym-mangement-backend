import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { OrderEntity } from "./entity/order.entity";
import { OrderStatus } from "./enum/order.enum";

@Injectable({ scope: Scope.REQUEST })
export class OrderService {
  constructor(
    @Inject(REQUEST) private req: Request,
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>
  ) {}

  getAllOrdered() {
    const { id: userId } = this.req.user;
    return this.orderRepository.find({
      where: {
        userId,
        status: OrderStatus.Ordered,
      },
    });
  }
  async findById(orderId: number) {
    const order = await this.orderRepository.findOneBy({ id: orderId });
    if (!order) throw new NotFoundException("order not found");
    return order;
  }

  async setInProcess(orderId: number) {
    const order = await this.findById(orderId);
    if (order.status !== OrderStatus.Ordered)
      throw new BadRequestException("order not in paid queue");
    order.status = OrderStatus.InProcess;
    await this.orderRepository.save(order);
    return {
      message: "changes status successfully",
    };
  }

  async setPacked(orderId: number) {
    const order = await this.findById(orderId);
    if (order.status !== OrderStatus.InProcess)
      throw new BadRequestException("order not in process queue");
    order.status = OrderStatus.Packed;
    await this.orderRepository.save(order);
    return {
      message: "changes status successfully",
    };
  }
  async setToTransit(orderId: number) {
    const order = await this.findById(orderId);
    if (order.status !== OrderStatus.Packed)
      throw new BadRequestException("order not packed");
    order.status = OrderStatus.InTransit;
    await this.orderRepository.save(order);
    return {
      message: "changes status successfully",
    };
  }
  async delivery(orderId: number) {
    const order = await this.findById(orderId);
    if (order.status !== OrderStatus.InTransit)
      throw new BadRequestException("order not in transit");
    order.status = OrderStatus.Delivered;
    await this.orderRepository.save(order);
    return {
      message: "changes status successfully",
    };
  }
  async canceled(orderId: number) {
    const order = await this.findById(orderId);
    if (
      order.status === OrderStatus.Canceled ||
      order.status === OrderStatus.Pending
    )
      throw new BadRequestException("you cant canceled this order");
    order.status = OrderStatus.Canceled;
    await this.orderRepository.save(order);
    return {
      message: "canceled successfully",
    };
  }
}
