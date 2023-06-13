import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { BannedService } from './banned.service';
import { CreateBannedDto } from './dto/create-banned.dto';
import { UpdateBannedDto } from './dto/update-banned.dto';
import { AdminAccessGuard } from 'src/guards/admin.guard';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Banned')
@Controller('banned')
export class BannedController {
  constructor(private readonly bannedService: BannedService) {}

  @UseGuards(AdminAccessGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(
            null,
            file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
          );
        },
      }),
    }),
  )
  create(@Body() createBannedDto: CreateBannedDto, @UploadedFile() file) {
    return this.bannedService.create(createBannedDto, file.path);
  }

  @UseGuards(AdminAccessGuard)
  @Get()
  findAll() {
    return this.bannedService.findAll();
  }

  @UseGuards(AdminAccessGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bannedService.findOne(+id);
  }

  @UseGuards(AdminAccessGuard)
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(
            null,
            file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
          );
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateBannedDto: UpdateBannedDto,
    @UploadedFile() file,
  ) {
    return this.bannedService.update(+id, updateBannedDto, file);
  }

  @UseGuards(AdminAccessGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bannedService.remove(+id);
  }
}
