import { LoginInput } from './../types/LoginInput';
import { RegisterInput } from './../types/RegisterInput';
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { User } from "./../entities/User";
import 'reflect-metadata';
import * as argon2 from 'argon2';
import { UserMutationResponse } from '../types/UserMutationResponse';
import { createAccessToken } from '../utils/auth';

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

    return {
      code: 200,
      success: true,
      message: 'Login successful',
      user: existUser,
      accessToken: createAccessToken(existUser),
    }
  }

}