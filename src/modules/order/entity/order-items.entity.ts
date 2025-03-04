import { EntityNames } from "src/common/enum/entity.enum";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderEntity } from "./order.entity";
import { MembershipPlanEntity } from "src/modules/membership/entity/membership-plan.entity";
@Entity(EntityNames.OrderItems)
export class OrderItemsEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  orderId: number;
  @Column({ nullable: true })
  productId: number;
  @Column({ nullable: true })
  planId: number;
  @Column({ nullable: true })
  count: number;
  @ManyToOne(() => OrderEntity, (order) => order.items)
  order: OrderEntity;
  @ManyToOne(() => MembershipPlanEntity, (plan) => plan.orders)
  plan: MembershipPlanEntity;
}
