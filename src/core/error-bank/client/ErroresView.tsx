'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useErrorBankStore } from './useErrorBankStore';
import { useTrainingStore } from '@/core/training-quiz/client/useTrainingStore';
import { soundFx } from '@/core/shared/client/AudioSynthesizer';
import { Question } from '@/core/training-quiz/domain/Question';

export const ErroresView: React.FC = () => {
  const router = useRouter();
  const errors = useErrorBankStore((s) => s.errors);
  const clearAllErrors = useErrorBankStore((s) => s.clearAllErrors);
  const initQuestions = useTrainingStore((s) => s.initQuestions);

  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/data/balotario-200.json')
      .then((res) => res.json())
      .then((data: Question[]) => setAllQuestions(data))
      .catch((err) => console.error('Error fetching questions for error bank:', err));
  }, []);

  const errorIds = Object.keys(errors).map(Number);
  const errorCount = errorIds.length;
  const failedQuestions = allQuestions.filter((q) => errorIds.includes(q.id));

  // Category counts
  const signalErrors = failedQuestions.filter((q) => !!q.mediaUrl).length;
  const ruleErrors = failedQuestions.filter((q) => q.category.toLowerCase().includes('reglas') || q.category.toLowerCase().includes('prioridad')).length;
  const otherErrors = errorCount - signalErrors;

  // Percentage of master (200 - errorCount) / 200
  const masteredPercentage = Math.round(((200 - errorCount) / 200) * 100);

  const handleStartReview = () => {
    soundFx.playClick();
    if (failedQuestions.length > 0) {
      initQuestions(failedQuestions);
      router.push('/quiz');
    }
  };

  const handleStartReviewCategory = (categoryFilter: 'signals' | 'rules' | 'all') => {
    soundFx.playClick();
    let target = failedQuestions;
    if (categoryFilter === 'signals') {
      target = failedQuestions.filter((q) => !!q.mediaUrl);
    } else if (categoryFilter === 'rules') {
      target = failedQuestions.filter((q) => !q.mediaUrl);
    }

    if (target.length > 0) {
      initQuestions(target);
      router.push('/quiz');
    }
  };

  return (
    <main className="app-main">
      {/* Header */}
      <header className="screen-head" data-od-id="errors-header">
        <div>
          <div className="screen-kicker">Puntos débiles</div>
          <h1 className="screen-title">Banco de errores</h1>
        </div>
        <div className="telemetry-chip lives">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
          <span className="num">{errorCount > 0 ? `${errorCount}` : '0'}</span>
        </div>
      </header>

      {/* Review Queue Panel */}
      <section className="panel glass" data-od-id="review-queue" style={{ marginBottom: 24 }}>
        <div className="row-between" style={{ marginBottom: 16 }}>
          <span className="category">Repaso espaciado</span>
          <span className="micro">{errorCount} {errorCount === 1 ? 'pregunta' : 'preguntas'} en cola</span>
        </div>
        <h2 className="section-label" style={{ fontSize: 22 }}>
          {errorCount > 0
            ? 'Convierte cada error en una respuesta dominada.'
            : '¡Tu banco de errores está completamente limpio!'}
        </h2>
        <p className="muted" style={{ margin: '8px 0 16px', fontSize: 13 }}>
          {errorCount > 0
            ? 'Las preguntas falladas requieren 2 aciertos consecutivos en el repaso para salir del banco.'
            : 'Sigue practicando en el Entrenamiento Inteligente o realiza un Simulacro Oficial.'}
        </p>
        <div className="progress-track" style={{ height: 10 }}>
          <div className="progress-fill" style={{ width: `${masteredPercentage}%` }} />
        </div>
        <div className="row-between" style={{ marginTop: 8 }}>
          <span className="micro">Dominio del balotario</span>
          <span className="num micro" style={{ color: 'var(--success)' }}>{masteredPercentage}% dominado</span>
        </div>
      </section>

      {/* Categories Breakdown */}
      <section data-od-id="error-categories">
        <div className="row-between" style={{ marginBottom: 12 }}>
          <h2 className="section-label" style={{ margin: 0 }}>Por reforzar</h2>
          <span className="micro">Por categoría</span>
        </div>
        <div className="mode-list">
          {/* Signals */}
          <div
            className="mode-card glass"
            style={{ cursor: signalErrors > 0 ? 'pointer' : 'default', opacity: signalErrors > 0 ? 1 : 0.6 }}
            onClick={() => signalErrors > 0 && handleStartReviewCategory('signals')}
          >
            <span className="mode-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 3 3 20h18L12 3Z" />
                <path d="M12 9v5M12 17h.01" />
              </svg>
            </span>
            <span className="mode-copy">
              <strong>Señales y Gráficos</strong>
              <span>Errores en señales verticales, preventivas y cruces.</span>
            </span>
            <span className="badge">{signalErrors}</span>
          </div>

          {/* Rules & Priorities */}
          <div
            className="mode-card glass"
            style={{ cursor: ruleErrors > 0 ? 'pointer' : 'default', opacity: ruleErrors > 0 ? 1 : 0.6 }}
            onClick={() => ruleErrors > 0 && handleStartReviewCategory('rules')}
          >
            <span className="mode-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 18 9 6l3 12 3-12 5 12" />
              </svg>
            </span>
            <span className="mode-copy">
              <strong>Reglas de Tránsito y Prioridades</strong>
              <span>Cruces, giros, derecho de paso y velocidad.</span>
            </span>
            <span className="badge">{ruleErrors}</span>
          </div>

          {/* General & Sanctions */}
          <div
            className="mode-card glass"
            style={{ cursor: otherErrors > 0 ? 'pointer' : 'default', opacity: otherErrors > 0 ? 1 : 0.6 }}
            onClick={() => otherErrors > 0 && handleStartReviewCategory('all')}
          >
            <span className="mode-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="9" />
                <path d="M7 13h10M9 9h6" />
              </svg>
            </span>
            <span className="mode-copy">
              <strong>Infracciones y SOAT</strong>
              <span>Sanciones, puntos de licencia y primeros auxilios.</span>
            </span>
            <span className="badge">{otherErrors}</span>
          </div>
        </div>
      </section>

      {/* Action CTA */}
      <section style={{ marginTop: 24 }} data-od-id="error-action" className="stack">
        {errorCount > 0 ? (
          <>
            <button
              type="button"
              className="action"
              onClick={handleStartReview}
            >
              Iniciar repaso ({errorCount} falladas)
            </button>
            <button
              type="button"
              className="action secondary"
              onClick={() => {
                if (window.confirm('¿Seguro que deseas vaciar el banco de errores?')) {
                  soundFx.playClick();
                  clearAllErrors();
                }
              }}
              style={{ fontSize: 13 }}
            >
              Limpiar banco de errores
            </button>
          </>
        ) : (
          <Link
            href="/quiz"
            onClick={() => soundFx.playClick()}
            className="action"
          >
            Entrenar preguntas del balotario
          </Link>
        )}
      </section>
    </main>
  );
};
