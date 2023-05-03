import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as multer from 'multer';

@Injectable()
export class FileUploadMiddleware implements NestMiddleware {
  private multerUpload = multer({ dest: 'uploads/' });

  use(req: Request, res: Response, next: NextFunction) {
    this.multerUpload.single('avatar')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: 'Error while uploading file' });
      }
      next();
    });
  }
}
