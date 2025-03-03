import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { UserRole } from '@enums/user.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  versionKey: '_v',
})
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  fullName: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.MEMBER })
  userType: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ unique: true, required: true })
  mobile: string;

  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  resetToken: string;

  @Prop({ default: () => Date.now() })
  createdAt: number;

  @Prop({ default: () => Date.now() })
  updatedAt: number;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  this.createdAt = Date.now();
  this.updatedAt = Date.now();
  next();
});

UserSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

UserSchema.pre('updateOne', function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

UserSchema.pre('updateMany', function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

export { UserSchema };
