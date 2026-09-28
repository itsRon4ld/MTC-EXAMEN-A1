'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useExamStore } from './useExamStore';
import { soundFx } from '@/core/shared/client/AudioSynthesizer';
import { ExamDomainService } from '../domain/ExamSession';

export const SimulacroView: React.FC = () => {
  const router = useRouter();
  const {
    questions,
    currentIndex,
    userAnswers,
    flaggedQuestions,
    timeRemainingSeconds,
    status,
    selectAnswer,
    toggleFlag,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    tickTimer,
    submitExam,
    resetExam,
  } = useExamStore();

  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Timer interval
  useEffect(() => {
    if (status !== 'in_progress') return;

    const interval = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [status, tickTimer]);

  // Handle auto-finish if completed
  useEffect(() => {
    if (status === 'completed') {
      router.push('/resultados');
    }
  }, [status, router]);

  // If no questions loaded, redirect to intro
  useEffect(() => {
    if (questions.length === 0 && status === 'idle') {
      router.push('/simulacro-intro');
    }
  }, [questions.length, status, router]);

  if (questions.length === 0) {
    return (
      <main className="app-main quiz-main" style={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--muted)' }}>Cargando simulacro...</p>
      </main>
    );
  }

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(userAnswers).length;
  const currentAnswer = currentQ ? userAnswers[currentQ.id] : undefined;
  const isFlagged = currentQ ? !!flaggedQuestions[currentQ.id] : false;

  const handleSelectOption = (key: string) => {
    soundFx.playClick();
    if (currentQ) {
      selectAnswer(currentQ.id, key);
    }
  };

  const handleToggleFlag = () => {
    soundFx.playClick();
    if (currentQ) {
      toggleFlag(currentQ.id);
    }
  };

  const handleFinishClick = () => {
    soundFx.playClick();
    if (answeredCount < totalQuestions) {
      setShowSubmitConfirm(true);
    } else {
      finalizeExam();
    }
  };

  const finalizeExam = () => {
    submitExam();
    router.push('/resultados');
  };

  const handleExitExam = () => {
    soundFx.playClick();
    resetExam();
    router.push('/');
  };

  return (
    <div className="app-shell">
      <main className="app-main quiz-main">
        {/* Header */}
        <header className="screen-head" data-od-id="exam-header">
          <button
            type="button"
            className="icon-btn"
            onClick={() => setShowExitConfirm(true)}
            aria-label="Salir del simulacro"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>

          <div style={{ textAlign: 'center' }}>
            <div className="screen-kicker">Simulacro oficial</div>
            <strong className="num" style={{ fontSize: 16 }}>
              {currentIndex + 1} / {totalQuestions}
            </strong>
          </div>

          <div className="timer">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="13" r="8" />
              <path d="M12 9v4l3 2M9 2h6" />
            </svg>
            <span>{ExamDomainService.formatTime(timeRemainingSeconds)}</span>
          </div>
        </header>

        {/* Question Panel */}
        {currentQ && (
          <section className="panel glass exam-card" data-od-id="exam-question">
            <div className="row-between" style={{ marginBottom: 12 }}>
              <span className="category">
                Pregunta {currentIndex + 1} · {currentQ.category}
              </span>
              <button
                type="button"
                className="icon-btn"
                onClick={handleToggleFlag}
                style={{
                  borderColor: isFlagged ? 'var(--warn)' : undefined,
                  color: isFlagged ? 'var(--warn)' : 'var(--muted)',
                  background: isFlagged ? 'color-mix(in oklch, var(--warn) 15%, transparent)' : undefined,
                }}
                aria-label={isFlagged ? 'Desmarcar bandera' : 'Marcar para revisar'}
              >
                <svg viewBox="0 0 24 24" fill={isFlagged ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 3v18M6 4h11l-2 4 2 4H6" />
                </svg>
              </button>
            </div>

            <h1 className="exam-question">{currentQ.prompt}</h1>

            {/* Image container if present */}
            {currentQ.mediaUrl && (
              <div className="question-media">
                <Image
                  src={currentQ.mediaUrl}
                  alt={`Diagrama para pregunta ${currentQ.id}`}
                  width={300}
                  height={150}
                  unoptimized
                  style={{
                    maxHeight: 160,
                    width: 'auto',
                    objectFit: 'contain',
                    borderRadius: 'var(--radius-sm)',
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
                  }}
                />
              </div>
            )}

            {/* Alternatives */}
            <div className="answers">
              {currentQ.options.map((alt) => {
                const isSelected = currentAnswer?.toLowerCase() === alt.key.toLowerCase();
                return (
                  <div key={alt.key}>
                    <input
                      className="answer-input"
                      id={`alt-${alt.key}`}
                      name={`exam-${currentQ.id}`}
                      type="radio"
                      checked={isSelected}
                      onChange={() => handleSelectOption(alt.key)}
                    />
                    <label
                      className={`answer ${isSelected ? 'selected' : ''}`}
                      htmlFor={`alt-${alt.key}`}
                      onClick={() => handleSelectOption(alt.key)}
                    >
                      <span className="answer-key">{alt.key.toUpperCase()}</span>
                      <span>{alt.text}</span>
                    </label>
                  </div>
                );
              })}
            </div>

            {/* Quick Prev / Next Buttons inside card */}
            <div className="row-between" style={{ marginTop: 20 }}>
              <button
                type="button"
                className="action secondary"
                style={{ width: '48%', minHeight: 44, fontSize: 13 }}
                onClick={() => {
                  soundFx.playClick();
                  prevQuestion();
                }}
                disabled={currentIndex === 0}
              >
                ‹ Anterior
              </button>
              <button
                type="button"
                className="action secondary"
                style={{ width: '48%', minHeight: 44, fontSize: 13 }}
                onClick={() => {
                  soundFx.playClick();
                  nextQuestion();
                }}
                disabled={currentIndex === totalQuestions - 1}
              >
                Siguiente ›
              </button>
            </div>
          </section>
        )}

        {/* 50-Cell Interactive Navigator */}
        <section className="panel glass" data-od-id="question-navigator" style={{ marginTop: 16, marginBottom: 80 }}>
          <div className="row-between" style={{ marginBottom: 14 }}>
            <h2 className="section-label" style={{ margin: 0 }}>Navegador</h2>
            <span className="micro">{answeredCount} respondidas de {totalQuestions}</span>
          </div>

          <div className="exam-legend">
            <span className="legend-item">
              <i className="legend-dot done"></i>Respondida
            </span>
            <span className="legend-item">
              <i className="legend-dot flag"></i>Marcada
            </span>
            <span className="legend-item">
              <i className="legend-dot"></i>Vacía
            </span>
          </div>

          <div className="question-grid" aria-label="Preguntas 1 a 50">
            {questions.map((q, idx) => {
              const isAnswered = !!userAnswers[q.id];
              const isFlag = !!flaggedQuestions[q.id];
              const isCurrent = idx === currentIndex;

              let cellClass = 'q-cell';
              if (isCurrent) {
                cellClass += ' current';
              } else if (isFlag) {
                cellClass += ' flag';
              } else if (isAnswered) {
                cellClass += ' done';
              }

              return (
                <span
                  key={q.id}
                  className={cellClass}
                  onClick={() => {
                    soundFx.playClick();
                    goToQuestion(idx);
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Ir a pregunta ${idx + 1}`}
                >
                  {idx + 1}
                </span>
              );
            })}
          </div>
        </section>
      </main>

      {/* Sticky Bottom Action */}
      <div className="sticky-action">
        <button
          type="button"
          className="action"
          onClick={handleFinishClick}
        >
          Finalizar simulacro
        </button>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            background: 'rgba(0,0,0,0.8)',
            display: 'grid',
            placeItems: 'center',
            padding: 20,
            backdropFilter: 'blur(8px)',
          }}
        >
          <div className="panel glass" style={{ maxWidth: 380, width: '100%', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, margin: '0 0 10px' }}>
              ¿Deseas salir del simulacro?
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 'var(--text-sm)', marginBottom: 20 }}>
              Si sales ahora se perderá tu progreso del examen actual.
            </p>
            <div className="stack">
              <button
                type="button"
                className="action"
                style={{ background: 'var(--danger)', color: '#fff', boxShadow: '0 6px 0 #991b1b' }}
                onClick={handleExitExam}
              >
                Sí, salir
              </button>
              <button
                type="button"
                className="action secondary"
                onClick={() => {
                  soundFx.playClick();
                  setShowExitConfirm(false);
                }}
              >
                Continuar examen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Incomplete Warning Modal */}
      {showSubmitConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            background: 'rgba(0,0,0,0.8)',
            display: 'grid',
            placeItems: 'center',
            padding: 20,
            backdropFilter: 'blur(8px)',
          }}
        >
          <div className="panel glass" style={{ maxWidth: 380, width: '100%', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, margin: '0 0 10px' }}>
              ¿Finalizar simulacro?
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 'var(--text-sm)', marginBottom: 20 }}>
              Tienes <strong style={{ color: 'var(--warn)' }}>{totalQuestions - answeredCount}</strong> preguntas sin responder. Las preguntas no respondidas se calificarán como incorrectas.
            </p>
            <div className="stack">
              <button
                type="button"
                className="action"
                onClick={finalizeExam}
              >
                Enviar y calificar
              </button>
              <button
                type="button"
                className="action secondary"
                onClick={() => {
                  soundFx.playClick();
                  setShowSubmitConfirm(false);
                }}
              >
                Seguir respondiendo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
