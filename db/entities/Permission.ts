import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Role } from "./Role.js";
// import { User } from "../../types/users.js";
//   import bcrypt from "bcrypt";

@Entity()
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    type: "enum",
    enum: ["create_post", "edit_user", "delete_comment"],
    default: "create_post",
  })
  name: "create_post" | "edit_user" | "delete_comment";

  @ManyToMany(() => Role, { cascade: true })
  roles: Role[];
}
// add many to many  with Role ,
