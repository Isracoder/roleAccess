import { DataSource } from "typeorm";

import { User } from "./entities/User.js";
import { Profile } from "./entities/Profile.js";
import { Role } from "./entities/Role.js";
import { Permission } from "./entities/Permission.js";
import config from "./hidden.js";
// when not using aws rds
// host : "localhost"
// username: "root"
// password: ""

const dataSource = new DataSource({
  type: "mysql",
  host: config.host,
  port: 3306,
  username: config.username,
  password: config.password,
  database: "roleAccess",
  entities: [User, Profile, Role, Permission],
  synchronize: true,
  logging: true,
});

const initialize = () => {
  dataSource
    .initialize()
    .then(() => {
      console.log("Connected");
    })
    .catch((err) => {
      console.log(`A ${err} has occurred :( , Failed to connect to the DB`);
    });
};
export default { initialize, dataSource };
