import { IsEnum } from 'class-validator';
import { UserRole } from '../schema/user.schema';

export class UpdateRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}
