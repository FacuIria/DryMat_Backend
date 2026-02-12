import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const uri = config.get<string>('MONGO_URI');

        if (!uri) {
          throw new Error('MONGO_URI is missing in environment variables');
        }

        return {
          uri,
          dbName: 'drymat', // opcional: podés sacarlo si ya está en el URI
        };
      },
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
