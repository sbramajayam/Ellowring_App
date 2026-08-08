import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { extname, join } from 'path';

export type StoredFile = {
  fileId: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  purpose: string;
  originalName: string;
  path: string;
};

const PURPOSES = ['images', 'pdfs', 'certificates', 'resumes'] as const;
export type UploadPurpose = (typeof PURPOSES)[number];

@Injectable()
export class FilesService implements OnModuleInit {
  private readonly root = join(__dirname, '..', '..', 'uploads');
  private readonly registry = new Map<string, StoredFile>();

  onModuleInit() {
    for (const purpose of PURPOSES) {
      const dir = join(this.root, purpose);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    }
  }

  save(purpose: UploadPurpose, file: Express.Multer.File): StoredFile {
    const ext = extname(file.originalname) || '';
    const fileId = `${randomBytes(12).toString('hex')}${ext}`;
    const dir = join(this.root, purpose);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    const absPath = join(dir, fileId);
    writeFileSync(absPath, file.buffer);
    const meta: StoredFile = {
      fileId,
      url: `/uploads/${purpose}/${fileId}`,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      purpose,
      originalName: file.originalname,
      path: absPath,
    };
    this.registry.set(fileId, meta);
    return {
      fileId: meta.fileId,
      url: meta.url,
      mimeType: meta.mimeType,
      sizeBytes: meta.sizeBytes,
    } as StoredFile;
  }

  get(fileId: string): StoredFile {
    const meta = this.registry.get(fileId);
    if (!meta) {
      // fallback: search purpose folders by filename
      for (const purpose of PURPOSES) {
        const absPath = join(this.root, purpose, fileId);
        if (existsSync(absPath)) {
          const stub: StoredFile = {
            fileId,
            url: `/uploads/${purpose}/${fileId}`,
            mimeType: 'application/octet-stream',
            sizeBytes: 0,
            purpose,
            originalName: fileId,
            path: absPath,
          };
          this.registry.set(fileId, stub);
          return stub;
        }
      }
      throw new NotFoundException('File not found');
    }
    return meta;
  }

  delete(fileId: string) {
    const meta = this.get(fileId);
    if (existsSync(meta.path)) unlinkSync(meta.path);
    this.registry.delete(fileId);
    return { deleted: true, fileId };
  }
}
