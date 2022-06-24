import { Response } from 'express';
import { User } from "../entities/User";
import 'reflect-metadata';
import { Secret, sign } from "jsonwebtoken";

export const createAccessToken = (type: 'accessToken' | 'refreshToken', user: User) => sign(
  {
    userId: user.id,
    ...(type === "refreshToken" ? { tokenVersion: user.tokenVersion } : {})
  },
  type === 'accessToken' 
  ? process.env.JWT_SECRET as Secret
  : process.env.REFRESH_TOKEN_SECRET as Secret,
  {
    expiresIn: type === 'accessToken' ? '15s' : '60m',
  }, 
);

export const sendRefreshToken = (res: Response, user: User) => {
  res.cookie(process.env.REFRESH_TOKEN_COOKIE as string, createAccessToken('refreshToken', user), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax', 
    path: '/refresh-token' // request coming, 
  })
}