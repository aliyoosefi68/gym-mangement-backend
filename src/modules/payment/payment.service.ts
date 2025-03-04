import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaymentEntity } from "./entity/payment.entity";
import { Repository } from "typeorm";
import { OrderEntity } from "../order/entity/order.entity";
import { OrderItemsEntity } from "../order/entity/order-items.entity";
import { ZarinpalService } from "../http/zarinpal.service";
import { BasketService } from "../basket/basket.service";
import * as shortid from "shortid";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { OrderStatus } from "../order/enum/order.enum";
import { NotFoundMessage } from "src/common/enum/message.enum";
import { MembershipEntity } from "../membership/entity/membership.entity";
import { BasketEntity } from "../basket/Entity/basket.entity";

@Injectable({ scope: Scope.REQUEST })
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemsEntity)
    private orderItemRepository: Repository<OrderItemsEntity>,
    @InjectRepository(BasketEntity)
    private basketRepository: Repository<BasketEntity>,
    @InjectRepository(MembershipEntity)
    private membershipRepository: Repository<MembershipEntity>,
    private basketService: BasketService,
    private zarinpalService: ZarinpalService,
    @Inject(REQUEST) private req: Request
  ) {}

  async create() {
    const { id: userId, mobile } = this.req.user;

    let orderItems = {};
    let basket = await this.basketService.getUserBasket();

    let order = this.orderRepository.create({
      userId,
      final_amount: basket.paymant_amount,
      total_amount: basket.paymant_amount,
      status: OrderStatus.Pending,
    });
    order = await this.orderRepository.save(order);

    orderItems = {
      orderId: order.id,
      planId: +basket.plan.id,
    };
    await this.orderItemRepository.insert(orderItems);
    order = await this.orderRepository.save(order);

    const { authority, gatewayURL } = await this.zarinpalService.sendRequest({
      amount: +basket.paymant_amount,
      description: "خرید محصولات فیزیکی",
    });

    let payment = this.paymentRepository.create({
      userId,
      amount: basket.paymant_amount,
      authority,
      orderId: order.id,
      invoice_number: shortid.generate(),
      status: false,
    });
    payment = await this.paymentRepository.save(payment);
    order.paymentId = payment.id;
    await this.orderRepository.save(order);
    return { gatewayURL };
  }

  async verify(authority: string, status: string) {
    const { id: userId } = this.req.user;
    const payment = await this.paymentRepository.findOneBy({ authority });
    if (!payment) throw new NotFoundException(NotFoundMessage.NotFoundPayment);
    if (payment.status)
      throw new BadRequestException("already verified payment");

    if (status === "OK") {
      const order = await this.orderRepository.findOne({
        where: { id: payment.orderId },
      });
      const items = await this.orderItemRepository.find({
        where: { orderId: order.id },
        relations: { plan: true },
      });

      const item = items.find((item) => !!item.planId);
      const plan = item.plan;
      const currentDate = new Date();
      let membership = await this.membershipRepository.findOneBy({
        userId: payment.userId,
      });

      if (!membership) {
        await this.membershipRepository.insert({
          userId: payment.userId,
          plan,
          startDate: currentDate,
          endDate: new Date(
            currentDate.getTime() + plan.durationInDays * 24 * 60 * 60 * 1000
          ),
        });
      } else {
        if (membership.endDate < currentDate) {
          membership.startDate = currentDate;
          membership.endDate = new Date(
            currentDate.getTime() + plan.durationInDays * 24 * 60 * 60 * 1000
          );
        } else {
          let oldEndDate = membership.endDate;
          membership.endDate = new Date(
            oldEndDate.getTime() + plan.durationInDays * 24 * 60 * 60 * 1000
          );
        }
        await this.membershipRepository.save(membership);
      }

      if (!order) throw new NotFoundException("order not found");
      order.status = OrderStatus.Ordered;
      payment.status = true;
      await Promise.all([
        this.paymentRepository.save(payment),
        this.orderRepository.save(order),
        this.basketRepository.delete({ userId }),
      ]);
      return "https://frontendurl.com/payment/success?order_no=" + order.id;
    } else {
      return "https://frontendurl.com/payment/failure";
    }
  }

  async find() {
    return this.paymentRepository.find({
      order: {
        created_at: "DESC",
      },
    });
  }
}
