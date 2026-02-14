import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../users/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto & { adminCode?: string }) {
    // Verificar si el email ya existe
    const emailExists = await this.usersService.userModel.exists({
      email: dto.email.toLowerCase().trim(),
    });

    if (emailExists) {
      throw new BadRequestException('El email ya está registrado');
    }

    // Hashear la contraseña
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Determinar el rol (USER por defecto, ADMIN solo con código secreto)
    let role = UserRole.USER;
    const adminSecretCode = this.config.get<string>('ADMIN_SECRET_CODE');
    
    if (dto.adminCode && adminSecretCode && dto.adminCode === adminSecretCode) {
      role = UserRole.ADMIN;
    } else if (dto.role === UserRole.ADMIN) {
      // Intentó registrarse como admin sin código -> bloqueado
      throw new BadRequestException('No tienes permiso para crear un administrador');
    }

    // Crear usuario
    const user = await this.usersService.userModel.create({
      nombre: dto.nombre,
      apellido: dto.apellido,
      fechaNacimiento: new Date(dto.fechaNacimiento),
      email: dto.email.toLowerCase().trim(),
      genero: dto.genero,
      role,
      passwordHash,
    });

    // Generar token JWT
    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user: user.toJSON(),
      access_token: token,
    };
  }

  async login(dto: LoginDto) {
    // Buscar usuario por email (con passwordHash incluido)
    const user = await this.usersService.userModel
      .findOne({ email: dto.email.toLowerCase().trim() })
      .select('+passwordHash')
      .exec();

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Validar contraseña
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar token JWT
    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user: user.toJSON(),
      access_token: token,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.userModel
      .findOne({ email: email.toLowerCase().trim() })
      .select('+passwordHash')
      .exec();

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      return null;
    }

    return user.toJSON();
  }

  private generateToken(userId: string, email: string, role: string): string {
    const payload = {
      sub: userId,
      email,
      role,
    };

    return this.jwtService.sign(payload);
  }
}
