import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsDateString,
  MinLength,
} from 'class-validator';

import { UserRole, UserGender } from '../schema/user.schema';

export class CreateUserDto {
  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsDateString()
  fechaNacimiento: string; // viene como ISO string

  @IsEmail()
  email: string;

  @IsEnum(UserGender)
  genero: UserGender;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @MinLength(6)
  password: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsDateString()
  fechaNacimiento?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(UserGender)
  genero?: UserGender;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @MinLength(6)
  password?: string;
}
