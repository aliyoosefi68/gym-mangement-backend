import { EntityNames } from "src/common/enum/entity.enum";
import { MembershipPlanEntity } from "src/modules/membership/entity/membership-plan.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";

@Entity(EntityNames.Basket)
export class BasketEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  userId: number;
  @Column()
  planId: number;
  @ManyToOne(() => MembershipPlanEntity, (plan) => plan.baskets, {
    onDelete: "CASCADE",
  })
  plan: MembershipPlanEntity;
}
