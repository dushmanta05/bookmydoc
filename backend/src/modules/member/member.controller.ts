import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MemberService } from './member.service';
import type { CreateMemberDto } from './dto/create-member.dto';
import type { UpdateMemberDto } from './dto/update-member.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MemberResponseDto } from './dto/member-response.dto';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new member' })
  @ApiResponse({
    status: 201,
    description: 'The member has been successfully created.',
    type: MemberResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createMemberDto: CreateMemberDto) {
    return this.memberService.create(createMemberDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all members' })
  @ApiResponse({
    status: 200,
    description: 'Return all members.',
    type: [MemberResponseDto],
  })
  async findAll() {
    return this.memberService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a member by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the member.',
    type: MemberResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Member not found.' })
  async findOne(@Param('id') id: string) {
    return this.memberService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get a member by userId' })
  @ApiResponse({
    status: 200,
    description: 'Return the member.',
    type: MemberResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Member not found.' })
  async findByUserId(@Param('userId') userId: string) {
    return this.memberService.findByUserId(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a member' })
  @ApiResponse({
    status: 200,
    description: 'The member has been successfully updated.',
    type: MemberResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Member not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    return this.memberService.update(id, updateMemberDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a member' })
  @ApiResponse({
    status: 200,
    description: 'The member has been successfully deleted.',
    type: MemberResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Member not found.' })
  async remove(@Param('id') id: string) {
    return this.memberService.remove(id);
  }
}
