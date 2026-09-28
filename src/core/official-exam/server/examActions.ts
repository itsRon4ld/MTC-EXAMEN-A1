import { QuizQueries } from '@/core/training-quiz/server/quizQueries';
import { ExamDomainService, ExamQuestion, ExamResult } from '../domain/ExamSession';

export class ExamActions {
  /**
   * Generates a new random 50-question mock exam session.
   */
  static generateExam(): ExamQuestion[] {
    const random50 = QuizQueries.getRandomQuestions(50);
    return random50.map((q, idx) => ({
      ...q,
      index: idx + 1,
    }));
  }

  /**
   * Submits and computes exam results.
   */
  static evaluateExam(
    questions: ExamQuestion[],
    userAnswers: Record<number, string>,
    flaggedMap: Record<number, boolean>,
    timeSpentSeconds: number
  ): ExamResult {
    return ExamDomainService.calculateResult(
      questions,
      userAnswers,
      flaggedMap,
      timeSpentSeconds
    );
  }
}
