import dataSource, { initialize } from '../dist/db/index.js';
import User from "../dist/db/entities/User.js";
import Profile from "../dist/db/entities/Profile.js";

import { login, createUser, addRoleToUser } from "../dist/controllers/user.js";
import jwt from "jsonwebtoken";
import { Role } from "../dist/db/entities/Role.js";
import { before } from "node:test";

beforeAll(async () => {
  await initialize();
});

afterAll(async () => {
  await dataSource.destroy();
});

const tmpData = {
  "email": "ahmad@email.com",
  "password": "123456" ,
};

describe("Login process", () => {
  let token;
  // const secretKey = "kdfjkdjfkd";
  beforeAll(async () => {
    token = await login(tmpData.email, tmpData.password);
    // token = "jdjf" ;
    console.log(`token ${token}`);
  });

  it("returns a token", async () => {
    expect(token).toBeTruthy();
  });

  it("has a valid token", () => {
    const tokenIsValid = jwt.verify(token, process.env.SECRET_KEY || "");
    expect(tokenIsValid).toBeTruthy();
  });

  it("has valid payload", () => {
    const payload = jwt.decode(token, { json: true });
    expect(payload?.email).toEqual(tmpData.email);
  });
});

describe("Creating a user", () => {
  const userData = {
    userName: "fjdk",
    password: "123",
    email: "dkjfd@gmail.com",
  };
  const profileData = {
    firstName: "djfhdh dkfjd",
    lastName: "zldlf djfjd",
    dateOfBirth: new Date("10/1/2000"),
  };
  let res;
  beforeAll(async () => {
    res = await createUser(
      userData.userName,
      userData.password,
      userData.email,
      profileData.firstName,
      profileData.lastName,
      profileData.dateOfBirth
    );
  });

  it("Creates a user and profile correctly", () => {
    console.log(`res ${res}`);
    expect(res).toBeTruthy();
  });

});

describe("Assigning a role to a user", () => {
  const roleData = {
    roleName: "admin",
    userId: "2",
  };
  console.log("hi");
  // const roleName = roleData.roleName;
  // console.log(roleName);
  // let role;
  // let user;
  let res ;
  beforeAll(async () => {
    res = await addRoleToUser(roleData.roleName , roleData.userId) ;
  });
  
  it("finds user and role then adds role to user successfully", () => {
    console.log("in final one");
    expect(res).toBeTruthy() ;
  });
});
