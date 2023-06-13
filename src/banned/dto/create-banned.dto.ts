import { IsNotEmpty } from 'class-validator';

export class CreateBannedDto {
  @IsNotEmpty()
  ipAddress: string;

  @IsNotEmpty()
  date: string;

  @IsNotEmpty()
  userAgent: string;

  @IsNotEmpty()
  requestId: string;
}
