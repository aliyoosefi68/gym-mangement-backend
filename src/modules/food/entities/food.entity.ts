import { EntityNames } from "src/common/enum/entity.enum";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { FoodCategoryEntity } from "./food-category.entity";
import { MealItemEntity } from "src/modules/food-plan/entities/meal-item.entity";

@Entity(EntityNames.Food)
export class FoodEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  title: string;
  @Column()
  recipe: string;
  @Column({ type: "decimal" })
  fat: number;
  @Column({ type: "decimal" })
  kaleri: number;
  @Column({ type: "decimal" })
  protoen: number;
  @Column({ type: "decimal" })
  sugar: number;
  @Column()
  categoryId: number;
  @Column({ nullable: true })
  imageUrl: string;
  @Column({ nullable: true })
  imageKey: string;

  @ManyToOne(() => FoodCategoryEntity, (category) => category.foods, {
    onDelete: "CASCADE",
  })
  category: FoodCategoryEntity;

  @OneToMany(() => MealItemEntity, (meal) => meal.food)
  items: MealItemEntity[];
}
