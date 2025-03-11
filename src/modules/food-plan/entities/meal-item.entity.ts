import { EntityNames } from "src/common/enum/entity.enum";
import { FoodEntity } from "src/modules/food/entities/food.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MealEntity } from "./meal.entity";

@Entity(EntityNames.MealItem)
export class MealItemEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column({ type: "decimal" })
  fat: number;
  @Column({ type: "decimal" })
  kaleri: number;
  @Column({ type: "decimal" })
  protoen: number;
  @Column({ type: "decimal" })
  sugar: number;
  @Column()
  count: number;
  @Column()
  foodId: number;
  @Column()
  mealId: number;
  @ManyToOne(() => MealEntity, (meal) => meal.items, {
    onDelete: "CASCADE",
  })
  meal: MealEntity;
  @ManyToOne(() => FoodEntity, (food) => food.items, {
    onDelete: "CASCADE",
  })
  food: FoodEntity;
}
