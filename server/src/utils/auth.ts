import { User } from "../entities/User";
import 'reflect-metadata';
import { Secret, sign } from "jsonwebtoken";

export const createAccessToken = (user: User) => sign(
  {
    userId: user.id,
  }, 
  process.env.JWT_SECRET as Secret,
  { 
    expiresIn: '60m',
  }
)