import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class S3UploadService {
  private client: S3Client | null = null;
  private bucket: string | null = null;
  private readonly isEnabled: boolean;

  constructor(private readonly logger: LoggerService) {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const region = process.env.AWS_REGION;
    const bucket = process.env.AWS_S3_BUCKET;

    this.isEnabled = !!(accessKeyId && secretAccessKey && region && bucket);

    if (this.isEnabled) {
      try {
        this.client = new S3Client({
          region,
          credentials: {
            accessKeyId: accessKeyId!,
            secretAccessKey: secretAccessKey!,
          },
        });
        this.bucket = bucket || null;
        this.logger.log('S3 upload service initialized', 'S3UploadService', { region, bucket });
      } catch (error) {
        this.logger.error(
          'Failed to initialize S3 client',
          error instanceof Error ? error.stack : undefined,
          'S3UploadService',
        );
        this.isEnabled = false;
      }
    } else {
      this.logger.warn(
        'S3 upload service disabled - missing AWS credentials',
        'S3UploadService',
      );
    }
  }

  async uploadFile(
    file: Buffer,
    key: string,
    contentType: string,
  ): Promise<{ url: string; key: string } | null> {
    if (!this.isEnabled || !this.client || !this.bucket) {
      this.logger.warn('S3 upload attempted but service is disabled', 'S3UploadService');
      return null;
    }

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ContentType: contentType,
        ACL: 'public-read',
      });

      await this.client.send(command);

      const url = `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      this.logger.log('File uploaded to S3 successfully', 'S3UploadService', {
        key,
        contentType,
      });

      return { url, key };
    } catch (error) {
      this.logger.error(
        `Failed to upload file to S3: ${key}`,
        error instanceof Error ? error.stack : undefined,
        'S3UploadService',
      );
      throw error;
    }
  }

  async deleteFile(key: string): Promise<boolean> {
    if (!this.isEnabled || !this.client || !this.bucket) {
      this.logger.warn('S3 delete attempted but service is disabled', 'S3UploadService');
      return false;
    }

    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.client.send(command);

      this.logger.log('File deleted from S3 successfully', 'S3UploadService', { key });

      return true;
    } catch (error) {
      this.logger.error(
        `Failed to delete file from S3: ${key}`,
        error instanceof Error ? error.stack : undefined,
        'S3UploadService',
      );
      return false;
    }
  }

  isServiceEnabled(): boolean {
    return this.isEnabled;
  }
}
