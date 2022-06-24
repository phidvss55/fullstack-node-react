import { LoginInput } from './../types/LoginInput';
import { RegisterInput } from './../types/RegisterInput';
import { Arg, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";
import { User } from "./../entities/User";
import 'reflect-metadata';
import * as argon2 from 'argon2';
import { UserMutationResponse } from '../types/UserMutationResponse';
import { createAccessToken, sendRefreshToken } from '../utils/auth';
import { Context } from '../types/Context';

@Resolver()
export class UserResolver {
  // Get all users
  @Query(() => [User])
  async users(): Promise<User[]> {
    return await User.find() // return all users
  }


  @Mutation(_return /* () */ => UserMutationResponse)
  async register(
    @Arg('registerInput')
    registerInput: RegisterInput
    ): Promise<UserMutationResponse> {
    const { username, password } = registerInput

    const existUser = await User.findOne({ where: { username } })

    if (existUser) {
      return {
        code: 400,
        success: false,
        message: 'Username already exists'
      }
    }

    const hashedPassword = await argon2.hash(password)
    const newUser = User.create({
      username, password: hashedPassword
    })

    await newUser.save()
    return {
      code: 200,
      success: true,
      message: 'User created successfully',
      user: newUser
    }
  }

  @Mutation(_return /* () */ => UserMutationResponse)
  async login(
    @Arg('loginInput')
    {username, password}: LoginInput,
    @Ctx() context: Context
  ): Promise<UserMutationResponse> {
    const existUser = await User.findOne({ where: { username } })
    if (!existUser) {
      return {
        code: 400,
        success: false,
        message: 'Username does not exist'
      }
    }

    const validPassword = await argon2.verify(existUser.password, password)
    if (!validPassword) {
      return {
        code: 400,
        success: false,
        message: 'Invalid password'
      }
    }

    sendRefreshToken(context.res, existUser);

    return {
      code: 200,
      success: true,
      message: 'Login successful',
      user: existUser,
      accessToken: createAccessToken('accessToken', existUser),
    }
  }

  @Mutation(_return => UserMutationResponse)
  async logout(
    @Arg('userId', _type => ID) userId: number,
    @Ctx() { res }: Context
  ) {
    const existUser = await User.findOne({ where: { id: userId }})

    if (!existUser) {
      return {
        code: 400,
        success: false
      }
    }

    existUser.tokenVersion += 1;
    await existUser.save();

    // clear process.env.REFRESH_TOKEN_COOKIE cookie when logout
    res.clearCookie(process.env.REFRESH_TOKEN_COOKIE as string, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax', 
      path: '/refresh-token' // request coming, 
    });

    return {
      code: 200, 
      success: true
    }
  }

}