import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User, UserDocument, UserRole } from './schema/user.schema';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  // ⚠️ Esto después lo movemos a Auth/register.
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.users.create(dto);
  }

  // ⚠️ Después: solo ADMIN
  @Get()
  findAll() {
    return this.users.findAll();
  }

  // ⚠️ Después: ADMIN o el mismo usuario
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.users.findById(id);
  }

  // ⚠️ Después: ADMIN o el mismo usuario
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.users.update(id, dto);
  }

  // ⚠️ Después: ADMIN o el mismo usuario
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.users.remove(id);
  }
}
