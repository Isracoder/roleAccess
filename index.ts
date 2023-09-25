import express from "express";
import db from "./db/index.js";
import { User } from "./db/entities/User.js";
import { Profile } from "./db/entities/Profile.js";
import { Permission } from "./db/entities/Permission.js";
import { Role } from "./db/entities/Role.js";
// import { create } from "domain";
import { addRoleToUser, createUser, login } from "./controllers/user.js";

import dotenv from "dotenv";
dotenv.config();
import { authenticate } from "./middlewares/auth/authenticate.js";

// import { User } from "./db/entities/User.js";
var app = express();

const PORT = 5000;

app.use(express.json());
// app.use("/", authenticate);

// homework 3 jwt + authentication
app.get("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // console.log("in post methodj");
  login(email, password)
    .then((data) => {
      console.log("hi ho here's the data");
      res.send(data);
    })
    .catch((err) => {
      console.log("error bad request");
      res.status(401).send(err);
    });
});

app.get("/secure", authenticate, (req, res, next) => {
  res.send("super secure route");
});

// homework 2 rbac
app.post("/user", async (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  };
  const profile = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    dateOfBirth: req.body.dateOfBirth,
  };
  // await profile.save();
  createUser(
    user.username,
    user.password,
    user.email,
    profile.firstName,
    profile.lastName,
    profile.dateOfBirth
  )
    .then(() => {
      res.status(201).send("user and profile created successfully");
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .send("something went wrong when trying to create user and profile");
    });
});

app.post("/permission", async (req, res) => {
  try {
    const permission = new Permission();
    permission.name = req.body.name;
    await permission.save();
    res.send("new permission created");
  } catch (error) {
    console.log(error);
    res.send("Error while creating new Permission");
  }
});

app.post("/role", async (req, res) => {
  try {
    const role = new Role();
    role.name = req.body.name;
    if (role.name == "admin") {
      try {
        const perm = await Permission.find({
          where: [
            { name: "edit_user" },
            {
              name: "create_post",
            },
            { name: "delete_comment" },
          ],
        });
        role.permisssions = perm;
      } catch (error) {
        res.send("Something went wrong when trying to create the admin");
        console.log(error);
      }
    } else if (role.name == "user") {
      try {
        const perm = await Permission.find({
          where: [
            {
              name: "create_post",
            },
          ],
        });
        console.log(perm);
        role.permisssions = perm;
      } catch (error) {
        console.log(error);
        res.send("couldn't find permissions for the user role");
        return;
      }
    } else if (role.name == "editor") {
      try {
        const perm = await Permission.find({
          where: [{ name: "edit_user" }],
        });
        role.permisssions = perm;
      } catch (error) {
        console.log(error);
        res.send("error for editor");
        return;
      }
    }

    await role.save();
    res.send("role created");
  } catch (error) {
    console.log(error);
    res.send("Error while creating new Role");
  }
});

app.get("/role/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const role = await Role.findOneBy({ id });
    if (role) {
      console.log("sent");
      console.log(id);
      res.send(role);
    } else {
      res.send("There was no role found with that Id");
    }
  } catch (e) {
    console.log(e);
    res.send("something went wrong when trying to get the role with that id");
  }
});

app.put("/assignRole/:Userid", async (req, res) => {
  console.log("hi in assign role");
  const roleName = req.body.roleName;
  if (!roleName || !req.params.Userid)
    res.send("error no rolename or userId was provided");
  addRoleToUser(roleName, req.params.Userid)
    .then(() => {
      res.status(200).send("role assigned successfully");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

app.get("/user/:id", async (req, res) => {
  const id = Number(req.params.id);
  const user = await User.findOneBy({ id });
  if (user) {
    res.send(user);
  } else {
    res.status(404).send("user not found!");
  }
});

// basic endpoints
app.get("/", (req, res) => {
  res.send("Server UP!");
});

app.use((req, res) => {
  res.status(404).send("You requested something I don't have :(");
});

app.listen(PORT, () => {
  console.log(`App is running and Listening on port ${PORT}`);
  db.initialize();
});
