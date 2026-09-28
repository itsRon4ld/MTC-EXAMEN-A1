export type AlternativeKey = 'a' | 'b' | 'c' | 'd';

export interface Alternative {
  key: AlternativeKey;
  text: string;
}

export interface Question {
  id: number;
  code: string | null;
  category: string;
  prompt: string;
  mediaUrl: string | null;
  options: Alternative[];
  correctAnswer: AlternativeKey;
  explanation: string;
}

export interface AnswerEvaluation {
  isCorrect: boolean;
  questionId: number;
  selectedKey: AlternativeKey;
  correctKey: AlternativeKey;
  explanation: string;
  xpGained: number;
}

export class QuestionDomainService {
  static evaluateAnswer(question: Question, selectedKey: AlternativeKey): AnswerEvaluation {
    const isCorrect = question.correctAnswer.toLowerCase() === selectedKey.toLowerCase();
    return {
      isCorrect,
      questionId: question.id,
      selectedKey,
      correctKey: question.correctAnswer,
      explanation: question.explanation || `La respuesta correcta según el MTC es la alternativa ${question.correctAnswer.toUpperCase()}.`,
      xpGained: isCorrect ? 10 : 0,
    };
  }
}
