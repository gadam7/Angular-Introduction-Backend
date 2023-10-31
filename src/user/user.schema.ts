import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class User {
  @Prop({ type: Number, required: true, unique: true })
  id: number;
  @Prop({ type: String, required: true })
  givenName: string;
  @Prop({ type: String, required: true })
  surName: string;
  @Prop({ type: Number, required: true })
  age: number;
  @Prop({ type: String, required: true, unique: true })
  email: string;
  @Prop({ type: String, required: true })
  address: string;
  @Prop({ type: String, default: '' })
  photoURL: string;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
