import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FilesService, UploadPurpose } from './files.service';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private files: FilesService) {}

  private upload(purpose: UploadPurpose, file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('file required');
    const saved = this.files.save(purpose, file);
    return {
      fileId: saved.fileId,
      url: saved.url,
      mimeType: saved.mimeType,
      sizeBytes: saved.sizeBytes,
    };
  }

  @Post('images')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  images(@UploadedFile() file: Express.Multer.File) {
    return this.upload('images', file);
  }

  @Post('pdfs')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  pdfs(@UploadedFile() file: Express.Multer.File) {
    return this.upload('pdfs', file);
  }

  @Post('certificates')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  certificates(@UploadedFile() file: Express.Multer.File) {
    return this.upload('certificates', file);
  }

  @Post('resumes')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  resumes(@UploadedFile() file: Express.Multer.File) {
    return this.upload('resumes', file);
  }

  @Get(':id')
  meta(@Param('id') id: string) {
    const f = this.files.get(id);
    return {
      fileId: f.fileId,
      url: f.url,
      mimeType: f.mimeType,
      sizeBytes: f.sizeBytes,
      purpose: f.purpose,
      originalName: f.originalName,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.files.delete(id);
  }
}
