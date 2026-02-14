import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { ContactModule } from './contact/contact.module';
import { MailModule } from './mail/mail.module';
import { AppController } from './app.controller';


@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    // Rate limiting: máximo 10 requests por minuto por IP
    ThrottlerModule.forRoot([{
      ttl: 60000, // 60 segundos
      limit: 100, // 100 requests
    }]),
    AuthModule,
    UsersModule,
    ProductsModule,
    ContactModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    // Aplicar rate limiting globalmente
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

