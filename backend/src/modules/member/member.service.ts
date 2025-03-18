import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

import { Member, type MemberDocument } from './schemas/member.schema';
import type { CreateMemberDto } from './dto/create-member.dto';
import type { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel(Member.name) private memberModel: Model<MemberDocument>,
  ) {}

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    return this.memberModel.create(createMemberDto);
  }

  async findAll(): Promise<Member[]> {
    return this.memberModel.find().populate('userId').exec();
  }

  async findOne(id: string): Promise<Member> {
    const member = await this.memberModel
      .findById(id)
      .populate('userId')
      .exec();
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    return member;
  }

  async findByUserId(userId: string): Promise<Member> {
    const member = await this.memberModel
      .findOne({ userId })
      .populate('userId')
      .exec();
    if (!member) {
      throw new NotFoundException(`Member with userId ${userId} not found`);
    }
    return member;
  }

  async update(id: string, updateMemberDto: UpdateMemberDto): Promise<Member> {
    const existingMember = await this.memberModel
      .findByIdAndUpdate(id, updateMemberDto, { new: true })
      .populate('userId')
      .exec();

    if (!existingMember) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }

    return existingMember;
  }

  async remove(id: string): Promise<Member> {
    const deletedMember = await this.memberModel.findByIdAndDelete(id).exec();
    if (!deletedMember) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    return deletedMember;
  }
}
