import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import type { Request, Response } from "express";

export interface ApiErrorBody {
  statusCode: number;
  message: string;
  error: string;
}

// Produces the consistent { statusCode, message, error } error shape for every
// unhandled response. `message` is always a string (the frontend client reads
// body.message; arrays from validation failures are reduced to the first item).
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const { statusCode, message, error } = this.toApiError(exception);

    if (statusCode >= 500) {
      this.logger.error(
        `${request.method} ${request.url} -> ${statusCode}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const body: ApiErrorBody = { statusCode, message, error };
    response.status(statusCode).json(body);
  }

  private toApiError(exception: unknown): ApiErrorBody {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      if (typeof body === "string") {
        return { statusCode: status, message: body, error: exception.name };
      }
      if (body && typeof body === "object") {
        const raw = body as Record<string, unknown>;
        let message: string;
        if (typeof raw.message === "string") {
          message = raw.message;
        } else if (Array.isArray(raw.message) && typeof raw.message[0] === "string") {
          message = raw.message[0];
        } else {
          message = exception.message;
        }
        const error = typeof raw.error === "string" ? raw.error : exception.name;
        return { statusCode: status, message, error };
      }
      return { statusCode: status, message: exception.message, error: exception.name };
    }

    if (
      exception instanceof Prisma.PrismaClientKnownRequestError &&
      exception.code === "P2025"
    ) {
      return { statusCode: 404, message: "Resource not found", error: "Not Found" };
    }

    return { statusCode: 500, message: "Internal server error", error: "Internal Server Error" };
  }
}
