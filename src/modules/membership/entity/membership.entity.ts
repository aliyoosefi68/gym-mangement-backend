import { EntityNames } from "src/common/enum/entity.enum";
import { UserEntity } from "src/modules/user/entity/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { MembershipPlanEntity } from "./membership-plan.entity";

@Entity(EntityNames.Membership)
export class MembershipEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  userId: number;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ default: false })
  isActive: boolean;

  @ManyToOne(() => UserEntity, (user) => user.memberships)
  user: UserEntity;

  @Column()
  planId: number;
  @ManyToOne(() => MembershipPlanEntity, (plan) => plan.memberships)
  plan: MembershipPlanEntity;

  @CreateDateColumn()
  createdAt: Date;
}
