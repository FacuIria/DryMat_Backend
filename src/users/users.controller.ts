import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UserRole } from './schema/user.schema';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  // ⚠️ Este endpoint ahora está en AuthController como /auth/register
  // Lo dejamos por si necesitas crear usuarios desde el panel admin
  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateUserDto) {
    return this.users.create(dto);
  }

  // Solo ADMIN puede ver todos los usuarios
  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.users.findAll();
  }

  // ADMIN o el mismo usuario pueden ver su perfil
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    // Si no es admin, solo puede ver su propio perfil
    if (user.role !== UserRole.ADMIN && user.id !== id) {
      throw new Error('No tienes permiso para ver este usuario');
    }
    return this.users.findById(id);
  }

  // ADMIN o el mismo usuario pueden actualizar
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto, @CurrentUser() user: any) {
    // Si no es admin, solo puede modificar su propio perfil
    if (user.role !== UserRole.ADMIN && user.id !== id) {
      throw new Error('No tienes permiso para modificar este usuario');
    }
    return this.users.update(id, dto);
  }

  // 🆕 NUEVO: Cambiar rol de un usuario (solo ADMIN)
  @Put(':id/role')
  @Roles(UserRole.ADMIN)
  updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.users.update(id, { role: dto.role });
  }

  // Solo ADMIN puede eliminar usuarios
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.users.remove(id);
  }
}
