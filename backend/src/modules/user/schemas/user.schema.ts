import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  fullName: string;

  @Prop({ required: true })
  userType: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ unique: true, required: true })
  mobile: string;

  @Prop({ required: true, enum: ['admin', 'member', 'doctor', 'superAdmin'] })
  password: string;

  @Prop({ required: true })
  resetToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
