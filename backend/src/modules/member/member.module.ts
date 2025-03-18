import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Member, MemberSchema } from './schemas/member.schema';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
  ],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
