import { Module } from '@nestjs/common';
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
    AuthModule,
    UsersModule,
    ProductsModule,
    ContactModule,
    MailModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
