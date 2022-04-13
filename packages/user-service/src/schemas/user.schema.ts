import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class MongooseUser {
  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ required: true })
  password: string;
}

export type UserDocument = MongooseUser & Document;
export const UserSchema = SchemaFactory.createForClass(MongooseUser);
