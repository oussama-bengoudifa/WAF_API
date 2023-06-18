import { Module } from '@nestjs/common';
import { BannedService } from './banned.service';
import { BannedController } from './banned.controller';
import { Banned } from './entities/banned.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwilioModule } from 'nestjs-twilio';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Banned]),
    TwilioModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (cfg: ConfigService) => ({
        accountSid: 'AC9436808ab3b30aa9bb0112d3c94b58ad',
        authToken: '9c23e99c1d6bd95aecb94d08c643caa7',
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [BannedController],
  providers: [BannedService],
})
export class BannedModule {}
