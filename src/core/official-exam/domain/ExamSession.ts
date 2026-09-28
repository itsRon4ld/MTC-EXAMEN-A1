import { Question } from '@/core/training-quiz/domain/Question';

export interface ExamQuestion extends Question {
  index: number; // 1 to 50
}

export interface ExamSessionState {
  id: string;
  startedAt: string;
  endedAt?: string;
  totalQuestions: number; // 50
  timeLimitSeconds: number; // 2400 (40 min)
  timeSpentSeconds: number;
  passingScore: number; // 40
  userAnswers: Record<number, string>; // questionId -> selected letter 'A', 'B', 'C', 'D'
  flaggedQuestionIds: Record<number, boolean>; // questionId -> true/false
}

export interface ExamResult {
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  flaggedCount: number;
  scorePercentage: number;
  isPassed: boolean;
  timeSpentFormatted: string;
  wrongQuestionIds: number[];
  flaggedQuestionIds: number[];
}

export const EXAM_CONSTANTS = {
  TOTAL_QUESTIONS: 50,
  TIME_LIMIT_SECONDS: 40 * 60, // 2400 seconds (40 mins)
  PASSING_SCORE: 40, // 40 / 50 (80%)
};

export class ExamDomainService {
  /**
   * Randomly selects 50 unique questions from the total pool of 200 questions.
   */
  static generateExamPool(allQuestions: Question[]): ExamQuestion[] {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, EXAM_CONSTANTS.TOTAL_QUESTIONS);
    return selected.map((q, idx) => ({
      ...q,
      index: idx + 1,
    }));
  }

  /**
   * Formats seconds into MM:SS string
   */
  static formatTime(seconds: number): string {
    const mins = Math.floor(Math.max(0, seconds) / 60);
    const secs = Math.max(0, seconds) % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Evaluates the full exam session and computes the final official result.
   */
  static calculateResult(
    questions: ExamQuestion[],
    userAnswers: Record<number, string>,
    flaggedMap: Record<number, boolean>,
    timeSpentSeconds: number
  ): ExamResult {
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;
    const wrongQuestionIds: number[] = [];
    const flaggedQuestionIds: number[] = [];

    questions.forEach((q) => {
      const selected = userAnswers[q.id];
      if (flaggedMap[q.id]) {
        flaggedQuestionIds.push(q.id);
      }

      if (!selected) {
        unansweredCount++;
        wrongQuestionIds.push(q.id);
      } else if (selected.toUpperCase() === q.correctAnswer.toUpperCase()) {
        correctCount++;
      } else {
        wrongCount++;
        wrongQuestionIds.push(q.id);
      }
    });

    const totalQuestions = questions.length || EXAM_CONSTANTS.TOTAL_QUESTIONS;
    const isPassed = correctCount >= EXAM_CONSTANTS.PASSING_SCORE;
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

    return {
      totalQuestions,
      answeredCount: totalQuestions - unansweredCount,
      correctCount,
      wrongCount,
      unansweredCount,
      flaggedCount: flaggedQuestionIds.length,
      scorePercentage,
      isPassed,
      timeSpentFormatted: this.formatTime(timeSpentSeconds),
      wrongQuestionIds,
      flaggedQuestionIds,
    };
  }
}
