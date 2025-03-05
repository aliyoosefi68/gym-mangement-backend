import { Roles } from "src/common/enum/role.enum";
import { MembershipEntity } from "src/modules/membership/entity/membership.entity";
import { OrderEntity } from "src/modules/order/entity/order.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserWeightEntity } from "./user-weight.entity";

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column({ unique: true })
  mobile: string;
  @Column({ default: Roles.User })
  role: string;
  @Column({ nullable: true })
  otp_code: string;
  @Column({ nullable: true })
  otp_expired_in: Date;

  @OneToMany(() => MembershipEntity, (membership) => membership.user)
  memberships: MembershipEntity[];

  @OneToMany(() => OrderEntity, (order) => order.address)
  orders: OrderEntity[];

  @OneToMany(() => UserWeightEntity, (weight) => weight.user)
  weights: UserWeightEntity[];
}
