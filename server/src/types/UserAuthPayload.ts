import { JwtPayload } from 'jsonwebtoken';

export type UserAuthPayload = JwtPayload & { userId: number, tokenVersion: number };
// export type UserAuthPayload = JwtPayload & { userId: number, username: string };

