import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../logger/logger.service';
import { ERROR_MESSAGES } from '../constants/app.constants';

interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string | string[];
  error?: string;
  stack?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR };

    let message: string | string[] = ERROR_MESSAGES.INTERNAL_SERVER_ERROR;

    if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
      const msg = exceptionResponse.message;
      if (typeof msg === 'string' || Array.isArray(msg)) {
        message = msg;
      }
    }

    const errorResponse: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error:
        exception instanceof HttpException
          ? exception.name
          : 'InternalServerError',
    };

    // Include stack trace only in development
    if (process.env.NODE_ENV !== 'production' && exception instanceof Error) {
      errorResponse.stack = exception.stack;
    }

    // Log error with context
    const logContext = {
      statusCode: status,
      path: request.url,
      method: request.method,
      userId: (request as any).user?.id,
      ip: request.ip,
      userAgent: request.get('user-agent'),
    };

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} - ${message}`,
        exception instanceof Error ? exception.stack : undefined,
        'HttpExceptionFilter',
        logContext,
      );
    } else if (status >= 400) {
      this.logger.warn(
        `${request.method} ${request.url} - ${message}`,
        'HttpExceptionFilter',
        logContext,
      );
    }

    response.status(status).json(errorResponse);
  }
}
