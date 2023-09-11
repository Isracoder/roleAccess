import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
// import { User } from "../../types/users.js";
import bcrypt from "bcrypt";
import { Profile } from "./Profile.js";
import { Role } from "./Role.js";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ length: 50, nullable: false })
  userName: string;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
  @Column({ nullable: false })
  password: string;

  @Column({})
  email: string;

  @OneToOne(() => Profile, { eager: true })
  @JoinColumn()
  profile: Profile;

  @ManyToMany(() => Role, { cascade: true, eager: true })
  @JoinTable()
  roles: Role[];
}
// add many to many with role ,     --complete
//  one to one with profile         --complete
