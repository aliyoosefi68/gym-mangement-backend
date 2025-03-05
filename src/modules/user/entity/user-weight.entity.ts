import { EntityNames } from "src/common/enum/entity.enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";

@Entity(EntityNames.UserWeight)
export class UserWeightEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  userId: number;
  @ManyToOne(() => UserEntity, (user) => user.weights, { onDelete: "CASCADE" })
  user: UserEntity;

  @Column({ type: "decimal" })
  currentWight: number;

  @CreateDateColumn()
  createdAt: Date;
}
