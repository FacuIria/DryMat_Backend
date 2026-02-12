import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum UserGender {
  M = 'Masculino',
  F = 'Femenino',
  OTHER = 'OTHER',
}

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform: (_doc, ret: any) => {
      ret.id = ret._id?.toString?.() ?? ret._id;
      delete ret._id;
      delete ret.passwordHash; // nunca devolverlo
      return ret;
    },
  },
})
export class User {
  @Prop({ required: true, trim: true })
  nombre: string;

  @Prop({ required: true, trim: true })
  apellido: string;

  @Prop({ required: true })
  fechaNacimiento: Date;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, enum: Object.values(UserGender) })
  genero: UserGender;

  @Prop({ required: true, enum: Object.values(UserRole), default: UserRole.USER })
  role: UserRole;

  // IMPORTANTE: select:false hace que NO salga por default en queries
  @Prop({ required: true, select: false })
  passwordHash: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
