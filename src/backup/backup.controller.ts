import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { BackupService } from './backup.service';

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Get()
  async download(@Res() res: Response) {
    const filePath = this.backupService.getBackupFilePath();

    if (!filePath) {
      return res.status(404).send('Database file not found!');
    }

    res.download(filePath, 'backup_db_phone_book.sqlite');
  }
}
