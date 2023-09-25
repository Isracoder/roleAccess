import { DataSource } from "typeorm";

import { User } from "./entities/User.js";
import { Profile } from "./entities/Profile.js";
import { Role } from "./entities/Role.js";
import { Permission } from "./entities/Permission.js";
import dotenv from "dotenv";
dotenv.config();

const dataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_host,
  port: Number(process.env.DB_port),
  username: process.env.DB_username,
  password: process.env.DB_password,
  database: "roleAccess",
  entities: [User, Profile, Role, Permission],
  synchronize: true,
  logging: true,
});

export const initialize = async () =>
  await dataSource
    .initialize()
    .then(() => {
      console.log("Connected to DB!");
    })
    .catch((err) => {
      console.error("Failed to connect to DB: " + err);
    });

export default dataSource;
