import {
 S3Client,
 PutObjectCommand,
 GetObjectCommand,
 DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const DEFAULT_REGION = "us-east-1";
const DEFAULT_SIGNED_URL_EXPIRATION = 3600;
const PDF_CONTENT_TYPE = "application/pdf";
const DOCX_CONTENT_TYPE =
 "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const PNG_CONTENT_TYPE = "image/png";
const JPEG_CONTENT_TYPE = "image/jpeg";

export interface StorageConfig {
 endpoint: string;
 accessKey: string;
 secretKey: string;
 bucket: string;
 region?: string;
}

interface FileUpload {
 key: string;
 buffer: Buffer;
 contentType: string;
}

class S3ClientFactory {
 static create(config: StorageConfig): S3Client {
  return new S3Client({
   endpoint: config.endpoint,
   region: config.region || DEFAULT_REGION,
   credentials: {
    accessKeyId: config.accessKey,
    secretAccessKey: config.secretKey,
   },
   forcePathStyle: true,
  });
 }
}

class FileKeyGenerator {
 static forResumePDF(userId: string, resumeId: string): string {
  return `resumes/${userId}/${resumeId}.pdf`;
 }

 static forResumeDOCX(userId: string, resumeId: string): string {
  return `resumes/${userId}/${resumeId}.docx`;
 }

 static forBanner(userId: string, format: "png" | "jpg"): string {
  return `banners/${userId}/linkedin-banner.${format}`;
 }

 static forAvatar(userId: string, format: "png" | "jpg"): string {
  return `avatars/${userId}/avatar.${format}`;
 }
}

class ContentTypeResolver {
 static forImageFormat(format: "png" | "jpg"): string {
  return format === "png" ? PNG_CONTENT_TYPE : JPEG_CONTENT_TYPE;
 }
}

export class StorageService {
 private constructor(
  private readonly s3Client: S3Client,
  private readonly bucket: string,
  private readonly endpoint: string
 ) {}

 static create(config: StorageConfig): StorageService {
  return new StorageService(
   S3ClientFactory.create(config),
   config.bucket,
   config.endpoint
  );
 }

 private buildPublicUrl(key: string): string {
  return `${this.endpoint}/${this.bucket}/${key}`;
 }

 private async executeUpload(upload: FileUpload): Promise<string> {
  const command = new PutObjectCommand({
   Bucket: this.bucket,
   Key: upload.key,
   Body: upload.buffer,
   ContentType: upload.contentType,
  });

  await this.s3Client.send(command);
  return this.buildPublicUrl(upload.key);
 }

 async uploadPDF(
  userId: string,
  resumeId: string,
  buffer: Buffer
 ): Promise<string> {
  return this.executeUpload({
   key: FileKeyGenerator.forResumePDF(userId, resumeId),
   buffer,
   contentType: PDF_CONTENT_TYPE,
  });
 }

 async uploadDOCX(
  userId: string,
  resumeId: string,
  buffer: Buffer
 ): Promise<string> {
  return this.executeUpload({
   key: FileKeyGenerator.forResumeDOCX(userId, resumeId),
   buffer,
   contentType: DOCX_CONTENT_TYPE,
  });
 }

 async uploadBanner(
  userId: string,
  buffer: Buffer,
  format: "png" | "jpg" = "png"
 ): Promise<string> {
  return this.executeUpload({
   key: FileKeyGenerator.forBanner(userId, format),
   buffer,
   contentType: ContentTypeResolver.forImageFormat(format),
  });
 }

 async uploadAvatar(
  userId: string,
  buffer: Buffer,
  format: "png" | "jpg" = "png"
 ): Promise<string> {
  return this.executeUpload({
   key: FileKeyGenerator.forAvatar(userId, format),
   buffer,
   contentType: ContentTypeResolver.forImageFormat(format),
  });
 }

 async getSignedUrl(
  key: string,
  expiresIn: number = DEFAULT_SIGNED_URL_EXPIRATION
 ): Promise<string> {
  const command = new GetObjectCommand({
   Bucket: this.bucket,
   Key: key,
  });
  return getSignedUrl(this.s3Client, command, { expiresIn });
 }

 private async deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
   Bucket: this.bucket,
   Key: key,
  });
  await this.s3Client.send(command);
 }

 async deleteResume(userId: string, resumeId: string): Promise<void> {
  await Promise.all([
   this.deleteFile(FileKeyGenerator.forResumePDF(userId, resumeId)),
   this.deleteFile(FileKeyGenerator.forResumeDOCX(userId, resumeId)),
  ]);
 }
}

class StorageServiceFactory {
 private static instance: StorageService | null = null;

 static getInstance(): StorageService {
  if (!this.instance) {
   this.instance = StorageService.create({
    endpoint: process.env.S3_ENDPOINT || "http://localhost:9000",
    accessKey: process.env.S3_ACCESS_KEY || "minioadmin",
    secretKey: process.env.S3_SECRET_KEY || "minioadmin",
    bucket: process.env.S3_BUCKET || "profile-resumes",
    region: process.env.S3_REGION || DEFAULT_REGION,
   });
  }
  return this.instance;
 }
}

export function getStorageService(): StorageService {
 return StorageServiceFactory.getInstance();
}
