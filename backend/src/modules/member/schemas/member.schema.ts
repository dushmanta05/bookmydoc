import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import type { User } from 'src/modules/user/schemas/user.schema';

export type MemberDocument = HydratedDocument<Member>;

@Schema({
  timestamps: true,
  versionKey: '_v',
})
export class Member {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  dob: Date;

  @Prop({ default: () => Date.now() })
  createdAt: number;

  @Prop({ default: () => Date.now() })
  updatedAt: number;
}

const MemberSchema = SchemaFactory.createForClass(Member);

MemberSchema.pre('save', function (next) {
  this.createdAt = Date.now();
  this.updatedAt = Date.now();
  next();
});

MemberSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

MemberSchema.pre('updateOne', function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

MemberSchema.pre('updateMany', function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

export { MemberSchema };
