import { Elysia, t } from 'elysia';
import { ResponseFactory } from '@/lib/common/responses/apiResponse';

export const errorBankApi = new Elysia({ prefix: '/errors' })
  /**
   * GET /api/errors
   * Returns information about error bank structure
   */
  .get('/', () => {
    return ResponseFactory.success({ message: 'Error bank API is active' });
  })

  /**
   * POST /api/errors/sync
   * Syncs local error state with server
   */
  .post(
    '/sync',
    ({ body }) => {
      const { errors } = body;
      return ResponseFactory.success({ syncedCount: Object.keys(errors).length });
    },
    {
      body: t.Object({
        errors: t.Record(t.String(), t.Any()),
      }),
    }
  );
