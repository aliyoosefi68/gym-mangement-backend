import { EntityNames } from "src/common/enum/entity.enum";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FoodEntity } from "./food.entity";

@Entity(EntityNames.FoodCategory)
export class FoodCategoryEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  title: string;
  @Column({ unique: true })
  slug: string;
  @Column()
  imageUrl: string;
  @Column({ nullable: true })
  imageKey: string;

  @OneToMany(() => FoodEntity, (food) => food.category)
  foods: FoodEntity[];
}
