import express from "express";
import db from "./db/index.js";
import { User } from "./db/entities/User.js";
import { Profile } from "./db/entities/Profile.js";
import { Permission } from "./db/entities/Permission.js";
import { Role } from "./db/entities/Role.js";

// import { User } from "./db/entities/User.js";
var app = express();

const PORT = 5000;

app.use(express.json());

app.post("/user", async (req, res) => {
  try {
    const user = new User();
    const profile = new Profile();
    user.userName = req.body.userName;
    profile.firstName = req.body.firstName;
    profile.lastName = req.body.lastName;
    profile.dateOfBirth = req.body.dateOfBirth;
    user.password = req.body.password;
    user.email = req.body.email;
    // await profile.save();
    user.profile = profile;
    // await user.save();
    db.dataSource
      .transaction(async (transactionManager) => {
        await transactionManager.save(profile);
        await transactionManager.save(user);
      })
      .then(() => {
        // res.send()
        res.send("User created and Profile created");
      })
      .catch((e) => {
        res.status(500).send(`Something went wrong ${e}`);
      });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong with creating a new user");
  }
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
    if (id) {
      const role = await Role.findOneBy({ id });
      console.log("sent");
      console.log(id);
      res.send(role);
    } else {
      res.send("That id wasn't found");
    }
  } catch (e) {
    console.log(e);
    res.send("something went wrong when trying to get the role with that id");
  }
});

app.put("/assignRole/:Userid", async (req, res) => {
  try {
    console.log("hi");
    const roleName = req.body.roleName;
    console.log(roleName);
    const role = await Role.findOneBy({ name: roleName });
    // const role = true;
    console.log("ho");
    const id = Number(req.params.Userid);
    const user = await User.findOneBy({ id: id });
    if (role && user) {
      // res.send("user found and role found");
      try {
        user.roles = [...user.roles, role];
        await user.save();
        res.send("user Updated");
      } catch (error) {
        res.send("Error assigning role to user");
        console.log(error);
      }
    } else {
      res.status(404).send("user or role not found!");
    }
  } catch (e) {
    console.log(e);
    res.send(`error ${e}`);
  }
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
