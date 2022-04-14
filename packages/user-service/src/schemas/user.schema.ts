import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
  User = 'user',
  Root = 'root',
}

@Schema()
export class MongooseUser {
  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: UserRole;
}

export type UserDocument = MongooseUser & Document;
export const UserSchema = SchemaFactory.createForClass(MongooseUser);
