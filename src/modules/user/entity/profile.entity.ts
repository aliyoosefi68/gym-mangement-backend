import { EntityNames } from "src/common/enum/entity.enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Gender } from "../enum/profile.enum";
import { UserEntity } from "./user.entity";

@Entity(EntityNames.Profile)
export class ProfileEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  userId: number;
  @Column()
  firstname: string;
  @Column()
  lastname: string;
  @Column({ nullable: true })
  imageUrl: string;
  @Column({ nullable: true })
  imageKey: string;
  @Column({ type: "enum", enum: Gender })
  gender: string;
  @Column()
  birthday: Date;
  @Column()
  email: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => UserEntity, (user) => user.profile, { onDelete: "CASCADE" })
  user: UserEntity;
}
