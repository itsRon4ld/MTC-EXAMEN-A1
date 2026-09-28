import { Elysia, t } from 'elysia';
import { ExamActions } from './examActions';
import { ResponseFactory } from '@/lib/common/responses/apiResponse';

export const examApi = new Elysia({ prefix: '/exam' })
  /**
   * GET /api/exam/new
   * Generates a new pool of 50 questions
   */
  .get('/new', () => {
    const examQuestions = ExamActions.generateExam();
    return ResponseFactory.success(examQuestions);
  })

  /**
   * POST /api/exam/submit
   * Evaluates user's answers and returns the final score
   */
  .post(
    '/submit',
    ({ body }) => {
      const { questions, userAnswers, flaggedMap, timeSpentSeconds } = body;
      const result = ExamActions.evaluateExam(
        questions as any,
        userAnswers,
        flaggedMap,
        timeSpentSeconds
      );
      return ResponseFactory.success(result);
    },
    {
      body: t.Object({
        questions: t.Array(t.Any()),
        userAnswers: t.Record(t.String(), t.String()),
        flaggedMap: t.Record(t.String(), t.Boolean()),
        timeSpentSeconds: t.Number(),
      }),
    }
  );
