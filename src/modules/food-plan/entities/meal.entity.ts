import { EntityNames } from "src/common/enum/entity.enum";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SubPlanEntity } from "./sub-plan.entity";
import { MealType } from "../enum/meal.enum";
import { MealItemEntity } from "./meal-item.entity";

@Entity(EntityNames.Meal)
export class MealEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column({ type: "enum", enum: MealType })
  title: string;
  @Column()
  subplanId: number;

  @ManyToOne(() => SubPlanEntity, (sub) => sub.meals, {
    onDelete: "CASCADE",
  })
  sub: SubPlanEntity;

  @OneToMany(() => MealItemEntity, (item) => item.meal)
  items: MealItemEntity[];
}
