import { JwtPayload } from 'jsonwebtoken';

export type UserAuthPayload = JwtPayload & { userId: number };
// export type UserAuthPayload = JwtPayload & { userId: number, username: string };

