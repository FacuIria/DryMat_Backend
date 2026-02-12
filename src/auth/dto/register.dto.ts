import { IsDateString, IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserGender, UserRole } from '../../users/schema/user.schema';

export class RegisterDto {
  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsDateString()
  fechaNacimiento: string;

  @IsEmail()
  email: string;

  @IsEnum(UserGender)
  genero: UserGender;

  // ✅ role opcional, pero OJO: lo vamos a forzar a USER salvo que registres admin manualmente
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsString()
  @MinLength(6)
  password: string;
}
