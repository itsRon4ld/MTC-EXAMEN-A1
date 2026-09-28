import { appRouter } from '@/core/shared/server/appRouter';

export const GET = (req: Request) => appRouter.handle(req);
export const POST = (req: Request) => appRouter.handle(req);
export const PUT = (req: Request) => appRouter.handle(req);
export const DELETE = (req: Request) => appRouter.handle(req);
export const PATCH = (req: Request) => appRouter.handle(req);
