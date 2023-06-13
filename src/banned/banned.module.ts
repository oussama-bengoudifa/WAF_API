import { Module } from '@nestjs/common';
import { BannedService } from './banned.service';
import { BannedController } from './banned.controller';
import { Banned } from './entities/banned.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Banned])],
  controllers: [BannedController],
  providers: [BannedService],
})
export class BannedModule {}
