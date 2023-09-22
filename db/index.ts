import { DataSource } from "typeorm";

import { User } from "./entities/User.js";
import { Profile } from "./entities/Profile.js";
import { Role } from "./entities/Role.js";
import { Permission } from "./entities/Permission.js";

const dataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
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
