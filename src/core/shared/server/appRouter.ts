import { createElysiaApp } from './elysiaRoot';
import { quizApi } from '@/core/training-quiz/server/api';
import { examApi } from '@/core/official-exam/server/api';
import { errorBankApi } from '@/core/error-bank/server/api';
import { codexApi } from '@/core/question-codex/server/api';

export const appRouter = createElysiaApp({ prefix: '/api' })
  .use(quizApi)
  .use(examApi)
  .use(errorBankApi)
  .use(codexApi);

export type AppRouter = typeof appRouter;
