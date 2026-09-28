import fs from 'fs';
import path from 'path';
import { Question } from '../domain/Question';

let cachedQuestions: Question[] | null = null;

export class QuizQueries {
  static getAllQuestions(): Question[] {
    if (cachedQuestions) {
      return cachedQuestions;
    }

    try {
      const filePath = path.join(process.cwd(), 'src', 'core', 'training-quiz', 'server', 'data', 'balotario-200.json');
      const fileData = fs.readFileSync(filePath, 'utf-8');
      cachedQuestions = JSON.parse(fileData) as Question[];
      return cachedQuestions;
    } catch (e) {
      console.error('[QuizQueries Error]:', e);
      return [];
    }
  }

  static getQuestionById(id: number): Question | null {
    const questions = this.getAllQuestions();
    return questions.find((q) => q.id === id) || null;
  }

  static getRandomQuestions(count: number = 50): Question[] {
    const questions = [...this.getAllQuestions()];
    // Fisher-Yates shuffle
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    return questions.slice(0, count);
  }

  static getQuestionsByCategory(category: string): Question[] {
    const questions = this.getAllQuestions();
    return questions.filter((q) => q.category.toLowerCase().includes(category.toLowerCase()));
  }
}
