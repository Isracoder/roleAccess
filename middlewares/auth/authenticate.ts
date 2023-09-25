import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../../db/entities/User.js";
import dotenv from "dotenv";
dotenv.config();

const authenticate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.headers["authorization"] || "";
  // console.log(req.headers);
  // console.log(`token ${token}`);
  let tokenIsValid;
  try {
    tokenIsValid = jwt.verify(token, process.env.SECRET_KEY || "");
    console.log(`token ${tokenIsValid}`);
  } catch (error) {}

  if (tokenIsValid) {
    const decoded = jwt.decode(token, { json: true });
    const user = await User.findOneBy({ email: decoded?.email || "" });
    res.locals.user = user;
    next();
  } else {
    res.status(401).send("You are Unauthorized!");
  }
};

export { authenticate };

// for authentication to work first login to user , then take what is returned upon login (the jwt token) and add it to headers under authorization
