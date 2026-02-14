import { plainToInstance } from 'class-transformer';
import { validateSync, IsInt, IsString, Min, IsOptional } from 'class-validator';

class EnvVars {
  @IsInt()
  @Min(1)
  PORT: number;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  MONGO_URI: string;

  @IsString()
  JWT_EXPIRATION: string;

  @IsOptional()
  @IsString()
  ADMIN_SECRET_CODE?: string;
}

export function validate(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvVars, {
    PORT: Number(config.PORT),
    JWT_SECRET: config.JWT_SECRET,
    MONGO_URI: config.MONGO_URI,
    JWT_EXPIRATION: config.JWT_EXPIRATION || '7d',
    ADMIN_SECRET_CODE: config.ADMIN_SECRET_CODE,
  });

  const errors = validateSync(validated, {
    skipMissingProperties: false,
  });

  if (errors.length) {
    throw new Error(
      `Invalid environment variables: ${errors
        .map((e) => e.property)
        .join(', ')}`,
    );
  }

  return validated;
}
