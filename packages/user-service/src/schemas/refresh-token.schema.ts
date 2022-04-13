import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { MongooseUser } from './user.schema';

@Schema()
export class MongooseRefreshToken {
  @Prop({ unique: true, required: true })
  token: string;

  @Prop({ required: true })
  createdAt: number;

  @Prop({ required: true })
  userId: string;
}

export type RefreshTokenDocument = MongooseRefreshToken & Document;
export const RefreshTokenSchema =
  SchemaFactory.createForClass(MongooseRefreshToken);
