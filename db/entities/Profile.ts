import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Timestamp,
} from "typeorm";
// import { User } from "../../types/users.js";
//   import bcrypt from "bcrypt";

@Entity()
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    nullable: false,
    length: 50,
  })
  firstName: string;
  @Column({
    nullable: false,
    length: 50,
  })
  lastName: string;

  @Column({
    nullable: false,
  })
  dateOfBirth: Date;
}
// add one to one  with user ,
