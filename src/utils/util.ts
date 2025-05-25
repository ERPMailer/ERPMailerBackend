
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};




export class FileUtils {
  private static readonly UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  static async ensureUploadDirectory(): Promise<void> {
    if (!fs.existsSync(this.UPLOAD_DIR)) {
      fs.mkdirSync(this.UPLOAD_DIR, { recursive: true });
    }
  }

  static async saveBase64File(base64Data: string, originalName: string): Promise<string> {
    await this.ensureUploadDirectory();

    // Extract file extension
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 data');
    }

    const mimeType = matches[1];
    const data = matches[2];
    const buffer = Buffer.from(data, 'base64');

    // Check file size
    if (buffer.length > this.MAX_FILE_SIZE) {
      throw new Error('File size exceeds maximum allowed size');
    }

    // Generate unique filename
    const hash = crypto.createHash('md5').update(buffer).digest('hex');
    const extension = this.getExtensionFromMimeType(mimeType);
    const filename = `${hash}_${Date.now()}${extension}`;
    const filepath = path.join(this.UPLOAD_DIR, filename);

    // Save file
    fs.writeFileSync(filepath, buffer);

    return filename;
  }

  static async deleteFile(filename: string): Promise<void> {
    const filepath = path.join(this.UPLOAD_DIR, filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  }

  private static getExtensionFromMimeType(mimeType: string): string {
    const extensions: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      'application/pdf': '.pdf',
      'text/plain': '.txt',
      'application/msword': '.doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx'
    };
    return extensions[mimeType] || '.bin';
  }
}
