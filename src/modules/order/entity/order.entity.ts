import { EntityNames } from "src/common/enum/entity.enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { OrderStatus } from "../enum/order.enum";
import { PaymentEntity } from "src/modules/payment/entity/payment.entity";
import { OrderItemsEntity } from "./order-items.entity";
import { UserEntity } from "src/modules/user/entity/user.entity";

@Entity(EntityNames.Order)
export class OrderEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  userId: number;
  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.Pending })
  status: string;
  @Column({ nullable: true })
  address: string;
  @Column({ nullable: true })
  paymentId: number;
  @Column()
  final_amount: number;
  @Column({ nullable: true })
  discount_amount: number;
  @Column({ nullable: true })
  total_amount: number;
  @CreateDateColumn()
  created_at: Date;
  @OneToOne(() => PaymentEntity, (payment) => payment.order, {
    onDelete: "SET NULL",
  })
  @JoinColumn()
  payment: PaymentEntity;

  @OneToMany(() => OrderItemsEntity, (item) => item.orderId, {
    onDelete: "CASCADE",
  })
  items: OrderItemsEntity[];

  @ManyToOne(() => UserEntity, (user) => user.orders, { onDelete: "CASCADE" })
  user: UserEntity;
}
