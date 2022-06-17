import { Field, InputType } from "type-graphql";
import 'reflect-metadata';

@InputType()
export class RegisterInput {
  @Field()
  username!: string;

  @Field()
  password!: string;
}