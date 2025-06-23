import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BackupService {
  getBackupFilePath(): string | null {
    const dbPath = process.env.SQLITE_DB_PATH || 'phone_book.sqlite';
    const filePath = path.resolve(dbPath);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    return filePath;
  }
}
