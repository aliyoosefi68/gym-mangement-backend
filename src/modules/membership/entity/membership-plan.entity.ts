import { EntityNames } from "src/common/enum/entity.enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { MembershipEntity } from "./membership.entity";
import { BasketEntity } from "src/modules/basket/Entity/basket.entity";
import { OrderItemsEntity } from "src/modules/order/entity/order-items.entity";

@Entity(EntityNames.MembershipPlan)
export class MembershipPlanEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: "decimal" })
  price: number;

  @Column()
  durationInDays: number;

  @OneToMany(() => MembershipEntity, (membership) => membership.plan)
  memberships: MembershipEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => BasketEntity, (basket) => basket.plan)
  baskets: BasketEntity[];

  @OneToMany(() => OrderItemsEntity, (order) => order.plan)
  orders: OrderItemsEntity[];
}
