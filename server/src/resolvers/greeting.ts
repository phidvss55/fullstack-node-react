import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import 'reflect-metadata';
import { checkAuth } from "../middleware/checkAuth";
import { Context } from "../types/Context";
import { User } from "../entities/User";

@Resolver()
export class GreetingResolver {
  @Query(_return => String)
  @UseMiddleware(checkAuth)
  async hello(@Ctx() { user }: Context): Promise<string> {
    const existingUser = await User.findOne({ where: { id: user.userId } });
    
    return `Hello ${existingUser ? existingUser.username : 'stranger'}`;
  }
}