import { EntityNames } from "src/common/enum/entity.enum";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { FoodPlanEntity } from "./food-plan.entity";
import { MealEntity } from "./meal.entity";

@Entity(EntityNames.SubPlan)
export class SubPlanEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  title: string;
  @Column()
  foodPlanId: number;

  @ManyToOne(() => FoodPlanEntity, (plan) => plan.subs, {
    onDelete: "CASCADE",
  })
  plan: FoodPlanEntity;

  @OneToMany(() => MealEntity, (meal) => meal.sub)
  meals: MealEntity[];
}
