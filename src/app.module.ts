import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BannedModule } from './banned/banned.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwilioModule } from 'nestjs-twilio';
import { User } from './users/entities/user.entity';
import { Banned } from './banned/entities/banned.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TwilioModule.forRoot({
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: 'db',
          port: 5432,
          username: 'postgres',
          password: 'postgres',
          database: 'postgres',
          entities: [User, Banned],
          synchronize: true,
          autoLoadEntities: true,
        };
      },
    }),
    UsersModule,
    BannedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
