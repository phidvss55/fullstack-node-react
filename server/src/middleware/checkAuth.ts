import { Context } from "../types/Context";
import { MiddlewareFn } from "type-graphql";
import { AuthenticationError } from "apollo-server-core";
import { Secret, verify } from "jsonwebtoken";
import { UserAuthPayload } from "../types/UserAuthPayload";

export const checkAuth: MiddlewareFn<Context> = ({ context }, next) => {
  try {
    // Authheader here is bearer token
    const authHeader = context.req.header('Authorization');
    const accessToken = authHeader && authHeader.split(' ')[1];

    if (!accessToken) {
      throw new AuthenticationError('Not authenticated');
    }

    const decodedUser = verify(accessToken, process.env.JWT_SECRET as Secret) as UserAuthPayload
    context.user = decodedUser;
 
    return next();
  } catch (error) {
    throw new AuthenticationError('Error authenticating user ' + JSON.stringify(error));
  }
}