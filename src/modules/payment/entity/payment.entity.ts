import { EntityNames } from "src/common/enum/entity.enum";
import { OrderEntity } from "src/modules/order/entity/order.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity(EntityNames.Payment)
export class PaymentEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "decimal" })
  amount: number;

  @Column()
  userId: number;

  @Column({ unique: true })
  invoice_number: string;

  @Column({ default: false })
  status: boolean;

  @Column({ nullable: true })
  refId: string;

  @Column({ nullable: true })
  authority: string;

  @Column({ nullable: true })
  orderId: number;

  @CreateDateColumn()
  created_at: Date;

  @OneToOne(() => OrderEntity, (order) => order.payment, {
    onDelete: "CASCADE",
  })
  order: OrderEntity;
}
