import React from 'react';
import { QuizView } from '@/core/training-quiz/client/QuizView';
import { QuizQueries } from '@/core/training-quiz/server/quizQueries';

export const metadata = {
  title: 'MTC-EXAM · Entrenamiento Inteligente',
  description: 'Entrena con el balotario oficial de 200 preguntas para tu examen de conducir.',
};

export default function QuizPage() {
  const initialQuestions = QuizQueries.getAllQuestions();

  return (
    <div className="app-shell min-h-screen">
      <QuizView initialQuestions={initialQuestions} />
    </div>
  );
}
