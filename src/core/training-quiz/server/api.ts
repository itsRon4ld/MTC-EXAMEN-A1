import { Elysia, t } from 'elysia';
import { QuizQueries } from './quizQueries';
import { QuestionDomainService, AlternativeKey } from '../domain/Question';
import { ResponseFactory, AppError, ErrorCodes } from '@/lib/common/responses';

export const quizApi = new Elysia({ prefix: '/quiz' })
  .get('/questions', () => {
    const questions = QuizQueries.getAllQuestions();
    return ResponseFactory.success(questions);
  })
  .get(
    '/questions/:id',
    ({ params }) => {
      const q = QuizQueries.getQuestionById(Number(params.id));
      if (!q) {
        throw AppError.notFound(`Pregunta con ID ${params.id} no encontrada.`, ErrorCodes.QUESTION_NOT_FOUND);
      }
      return ResponseFactory.success(q);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .post(
    '/evaluate',
    ({ body }) => {
      const q = QuizQueries.getQuestionById(body.questionId);
      if (!q) {
        throw AppError.notFound(`Pregunta con ID ${body.questionId} no encontrada.`, ErrorCodes.QUESTION_NOT_FOUND);
      }
      const evaluation = QuestionDomainService.evaluateAnswer(q, body.selectedKey as AlternativeKey);
      return ResponseFactory.success(evaluation);
    },
    {
      body: t.Object({
        questionId: t.Number(),
        selectedKey: t.String(),
      }),
    }
  );
