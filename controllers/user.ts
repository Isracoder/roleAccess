import { User } from "../db/entities/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Profile } from "../db/entities/Profile.js";
import datasource from "../db/index.js";
import dotenv from "dotenv";
import { Role } from "../db/entities/Role.js";
dotenv.config();

const login = async (email: string, password: string) => {
  console.log("in login");
  try {
    const user = await User.findOneBy({
      email: email,
    });

    const passwordMatching = await bcrypt.compare(
      password,
      user?.password || ""
    );
    // const secretKey = "kdfjkdjfkd";
    if (user && passwordMatching) {
      console.log("found user and the password matches");
      console.log(`process.env.escret key ${process.env.SECRET_KEY}`);
      // const token = "jdfd";
      const token = jwt.sign(
        {
          email: user.email,
          userName: user.userName,
          id: user.id, // user doesn't have a display name property
        },
        process.env.SECRET_KEY || "",
        // secretKey || "",
        {
          expiresIn: "2w", // 2 weeks
        }
      );
      console.log(`token in controller  ${token}`);

      return token;
    } else {
      throw "Invalid Username or password!";
    }
  } catch (error) {
    throw "Invalid Username or password!";
  }
};

const createUser = async (
  userName: string,
  password: string,
  email: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string
) => {
  try {
    const user = new User();
    const profile = new Profile();
    user.userName = userName;
    user.email = email;
    user.password = password;
    profile.firstName = firstName;
    profile.lastName = lastName;
    profile.dateOfBirth = new Date(dateOfBirth);
    // await profile.save();
    user.profile = profile;
    // await user.save();
    await datasource.manager.transaction(async (transactionManager) => {
      await transactionManager.save(profile);
      await transactionManager.save(user);
    });
    console.log("after transaction manager");
    return user;
  } catch (error) {
    console.log(error);
    throw "something went wrong";
  }
};

const addRoleToUser = async (
  roleName: "user" | "admin" | "editor",
  id: string | number
) => {
  try {
    console.log("hi");

    console.log(roleName);
    const role = await Role.findOneBy({ name: roleName });
    // const role = true;
    console.log("ho");

    const user = await User.findOneBy({ id: Number(id) });
    if (role && user) {
      console.log("user found and role found");
      try {
        user.roles = [...user.roles, role];
        await user.save();
        console.log("user Updated");
        return user;
      } catch (error) {
        console.log(error);
        throw "something went wrong";
      }
    } else {
      // console.log(error);
      console.log("not able to find role and user");
      throw "something went wrong";
    }
  } catch (error) {
    console.log(error);
    throw "something went wrong";
  }
};
export { login, createUser, addRoleToUser };
