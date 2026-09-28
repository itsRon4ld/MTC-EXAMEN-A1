import { Elysia } from 'elysia';
import { QuizQueries } from '@/core/training-quiz/server/quizQueries';
import { ResponseFactory } from '@/lib/common/responses/apiResponse';

export const codexApi = new Elysia({ prefix: '/codex' })
  /**
   * GET /api/codex/all
   * Returns all 200 questions
   */
  .get('/all', () => {
    const questions = QuizQueries.getAllQuestions();
    return ResponseFactory.success(questions);
  });
