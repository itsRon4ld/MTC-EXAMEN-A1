'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTrainingStore } from './useTrainingStore';
import { Question } from '../domain/Question';
import { useStreakStore } from '@/core/streak-gamification/client/useStreakStore';

export const QuizView: React.FC<{ initialQuestions?: Question[] }> = ({ initialQuestions }) => {
  const router = useRouter();
  const {
    questions,
    currentIndex,
    selectedOption,
    isAnswered,
    isCorrect,
    explanation,
    lives,
    isLoading,
    initQuestions,
    selectOption,
    checkAnswer,
    nextQuestion,
  } = useTrainingStore();

  const currentStreak = useStreakStore((s) => s.currentStreak);

  useEffect(() => {
    if (initialQuestions && initialQuestions.length > 0) {
      initQuestions(initialQuestions);
    } else if (questions.length === 0) {
      // Fetch questions client-side fallback
      fetch('/data/balotario-200.json')
        .then((res) => res.json())
        .then((data: Question[]) => initQuestions(data))
        .catch((err) => console.error('Error fetching questions:', err));
    }
  }, [initialQuestions, initQuestions, questions.length]);

  if (isLoading || questions.length === 0) {
    return (
      <main className="app-main quiz-main flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-[var(--success)] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="screen-kicker">Cargando balotario oficial...</p>
        </div>
      </main>
    );
  }

  const currentQ = questions[currentIndex];
  const progressPct = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <main className="app-main quiz-main">
      {/* Top Header */}
      <header className="quiz-top" data-od-id="quiz-progress">
        <Link href="/" className="icon-btn" aria-label="Cerrar entrenamiento">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </Link>
        <div className="progress-track" aria-label={`Progreso, pregunta ${currentIndex + 1} de ${questions.length}`}>
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="telemetry-chip streak">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M13.5 2s.5 4-2 6.5C9.1 10.9 9 14 11.2 15.7c-.2-2.2 1.1-3.6 2.3-4.7.6 2.5 3.5 3.3 3.5 6.2A5 5 0 0 1 7 17c0-4.9 3.2-7.2 6.5-15Z" />
          </svg>
          <span className="num">{currentStreak}</span>
        </div>
      </header>

      {/* Question Section */}
      <section data-od-id="question">
        <div className="quiz-meta">
          <span className="category">{currentQ.category || 'Materia General'}</span>
          <span className="micro num">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>

        <h1 className="question">{currentQ.prompt}</h1>

        {/* Media Container (Traffic Sign or Crossing Diagram) */}
        {currentQ.mediaUrl && (
          <div className="question-media" role="img" aria-label="Señal o gráfico vial oficial">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={currentQ.mediaUrl} alt={currentQ.code || 'Señal de tránsito'} />
          </div>
        )}

        {/* 4 Options */}
        <div className="answers" aria-label="Alternativas de respuesta">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOption === opt.key;
            let optionClass = 'answer';

            if (isAnswered) {
              if (opt.key.toLowerCase() === currentQ.correctAnswer.toLowerCase()) {
                optionClass += ' correct';
              } else if (isSelected && !isCorrect) {
                optionClass += ' wrong';
              }
            } else if (isSelected) {
              optionClass += ' selected';
            }

            return (
              <div
                key={opt.key}
                onClick={() => selectOption(opt.key)}
                className={optionClass}
                role="button"
                tabIndex={0}
              >
                <span className="answer-key">{opt.key.toUpperCase()}</span>
                <span className="text-sm font-medium">{opt.text}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Check Action Button */}
      {!isAnswered && (
        <div className="sticky-action">
          <button
            type="button"
            onClick={checkAnswer}
            disabled={!selectedOption}
            className="action"
          >
            Comprobar respuesta
          </button>
        </div>
      )}

      {/* Feedback Bottom Sheet */}
      {isAnswered && (
        <aside className={`feedback-sheet ${isCorrect ? 'correct' : 'wrong'}`} data-od-id="feedback-sheet">
          <div className="feedback-score">
            <span>{isCorrect ? '¡EXCELENTE!' : 'RESPUESTA REVISADA'}</span>
            <span>{isCorrect ? '+10 XP 🔥' : '+2 XP'}</span>
          </div>
          <h2>
            {isCorrect
              ? '¡Respuesta Correcta!'
              : `La correcta es la ${currentQ.correctAnswer.toUpperCase()}.`}
          </h2>
          <p>{explanation}</p>
          <button
            type="button"
            onClick={nextQuestion}
            className="action"
          >
            {currentIndex + 1 < questions.length ? 'Continuar ➔' : 'Finalizar Módulo ➔'}
          </button>
        </aside>
      )}
    </main>
  );
};
