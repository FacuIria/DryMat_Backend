import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User, UserDocument, UserRole } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) public readonly userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto) {
    const exists = await this.userModel.exists({ email: dto.email.toLowerCase().trim() });
    if (exists) throw new BadRequestException('Email ya registrado');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const doc = await this.userModel.create({
      nombre: dto.nombre,
      apellido: dto.apellido,
      fechaNacimiento: new Date(dto.fechaNacimiento),
      email: dto.email,
      genero: dto.genero,
      role: dto.role ?? UserRole.USER,
      passwordHash,
    });

    return doc.toJSON();
  }

  async findAll() {
    const docs = await this.userModel.find().sort({ createdAt: -1 }).exec();
    return docs.map((d) => d.toJSON());
  }

  async findById(id: string) {
    const doc = await this.userModel.findById(id).exec();
    if (!doc) throw new NotFoundException('Usuario no encontrado');
    return doc.toJSON();
  }

  async update(id: string, dto: UpdateUserDto) {
    const update: Partial<User> & { passwordHash?: string } = {};

    if (dto.nombre !== undefined) update.nombre = dto.nombre;
    if (dto.apellido !== undefined) update.apellido = dto.apellido;
    if (dto.fechaNacimiento !== undefined) update.fechaNacimiento = new Date(dto.fechaNacimiento);
    if (dto.email !== undefined) update.email = dto.email;
    if (dto.genero !== undefined) update.genero = dto.genero;
    if (dto.role !== undefined) update.role = dto.role;

    if (dto.password !== undefined) {
      update.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    // si cambia email, validamos duplicados
    if (dto.email) {
      const exists = await this.userModel.exists({
        _id: { $ne: id },
        email: dto.email.toLowerCase().trim(),
      });
      if (exists) throw new BadRequestException('Ese email ya está en uso');
    }

    const doc = await this.userModel.findByIdAndUpdate(id, update, { new: true }).exec();
    if (!doc) throw new NotFoundException('Usuario no encontrado');
    return doc.toJSON();
  }

  async remove(id: string) {
    const doc = await this.userModel.findByIdAndDelete(id).exec();
    if (!doc) throw new NotFoundException('Usuario no encontrado');
    return { ok: true };
  }
}
