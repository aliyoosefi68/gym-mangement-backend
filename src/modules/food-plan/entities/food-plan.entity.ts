import { EntityNames } from "src/common/enum/entity.enum";
import { UserEntity } from "src/modules/user/entity/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SubPlanEntity } from "./sub-plan.entity";

@Entity(EntityNames.FoodPlan)
export class FoodPlanEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  startDate: Date;
  @Column({ nullable: true })
  endDate: Date;

  @Column()
  userId: number;

  @Column({ nullable: true })
  duration: number;

  @ManyToOne(() => UserEntity, (user) => user.foodPlans, {
    onDelete: "CASCADE",
  })
  user: UserEntity;

  @OneToMany(() => SubPlanEntity, (sub) => sub.plan)
  subs: FoodPlanEntity[];

  @CreateDateColumn()
  createdAt: Date;
}
