import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBannedDto } from './dto/create-banned.dto';
import { UpdateBannedDto } from './dto/update-banned.dto';
import { Banned } from './entities/banned.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { unlinkSync } from 'fs';

@Injectable()
export class BannedService {
  constructor(@InjectRepository(Banned) private repo: Repository<Banned>) {}
  async create(createBannedDto: CreateBannedDto, file: string) {
    const { ipAddress, date, userAgent, requestId } = createBannedDto;

    const banned = this.repo.create({
      ipAddress,
      date,
      userAgent: userAgent ?? '',
      requestId,
      file,
    });
    await this.repo.save(banned);
    return banned;
  }

  async findAll() {
    const banned = await this.repo.find();

    return banned;
  }

  async ipAdressExists(ipAddress: string) {
    const banned = await this.repo.findOne({ where: { ipAddress } });

    return Boolean(banned);
  }

  async findOne(id: number) {
    const banned = await this.repo.findOne({ where: { id } });

    if (!banned) {
      throw new NotFoundException('Tuple not found');
    }

    return banned;
  }

  async update(id: number, updateBannedDto: UpdateBannedDto, file: any) {
    const banned = await this.findOne(id);

    if (file) {
      if (banned.file) {
        unlinkSync(banned.file);
      }
      banned.file = file.path;
    }

    Object.assign(banned, updateBannedDto);

    return this.repo.save(banned);
  }

  async remove(id: number) {
    const banned = await this.findOne(id);
    unlinkSync(banned.file);
    this.repo.delete(banned);
    return true;
  }
}
