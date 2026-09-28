import { Elysia } from 'elysia';
import { ResponseFactory, ErrorCodes } from '@/lib/common/responses';

export const createElysiaApp = (options?: { prefix?: string }) => {
  return new Elysia(options)
    .onError(({ error, set }) => {
      console.error('[API Error]:', error);
      
      if (error && typeof error === 'object' && 'statusCode' in error && 'code' in error) {
        const appErr = error as { statusCode: number; code: string; message: string; details?: unknown };
        set.status = appErr.statusCode;
        return ResponseFactory.error(appErr.code, appErr.message, appErr.details);
      }

      set.status = 500;
      const message = error instanceof Error ? error.message : 'Error inesperado del servidor';
      return ResponseFactory.error(ErrorCodes.INTERNAL_SERVER_ERROR, message);
    });
};
