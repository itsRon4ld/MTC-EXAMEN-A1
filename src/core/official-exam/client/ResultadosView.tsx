'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useExamStore } from './useExamStore';
import { useErrorBankStore } from '@/core/error-bank/client/useErrorBankStore';
import { useStreakStore } from '@/core/streak-gamification/client/useStreakStore';
import { soundFx } from '@/core/shared/client/AudioSynthesizer';

export const ResultadosView: React.FC = () => {
  const router = useRouter();
  const result = useExamStore((s) => s.result);
  const addError = useErrorBankStore((s) => s.addError);
  const recordActivity = useStreakStore((s) => s.recordActivity);
  const resetExam = useExamStore((s) => s.resetExam);

  useEffect(() => {
    if (result) {
      if (result.isPassed) {
        soundFx.playExamPass();
      } else {
        soundFx.playError();
      }

      // Automatically register failed questions into the Error Bank
      result.wrongQuestionIds.forEach((qId) => {
        addError(qId);
      });

      // Credit activity for daily goal
      recordActivity(result.isPassed);
    }
  }, [result, addError, recordActivity]);

  if (!result) {
    return (
      <main className="app-main" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <p style={{ color: 'var(--muted)', marginBottom: 20 }}>No hay resultados de simulacro recientes.</p>
        <Link
          href="/"
          onClick={() => {
            soundFx.playClick();
            resetExam();
          }}
          className="action"
        >
          Volver al Inicio
        </Link>
      </main>
    );
  }

  const { isPassed, correctCount, totalQuestions, scorePercentage, timeSpentFormatted, wrongCount, flaggedCount } = result;

  return (
    <div className="app-shell">
      <main className="app-main">
        {/* Header */}
        <header className="screen-head" data-od-id="result-header">
          <Link
            href="/"
            onClick={() => {
              soundFx.playClick();
              resetExam();
            }}
            className="icon-btn"
            aria-label="Volver al inicio"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
          <span className="screen-kicker">Resultado oficial</span>
          <span style={{ width: 44 }}></span>
        </header>

        {/* Hero Verdict */}
        <section className="result-hero" data-od-id="result-verdict">
          <div className={`result-mark ${isPassed ? '' : 'failed'}`}>
            {isPassed ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m5 12 4 4L19 6" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            )}
          </div>
          <h1>{isPassed ? '¡Aprobado!' : 'Desaprobado'}</h1>
          <p>
            {isPassed
              ? '¡Excelente trabajo! Superaste el mínimo de 40 respuestas correctas.'
              : `Obtuviste ${correctCount} aciertos. Necesitas al menos 40 para aprobar el examen del MTC.`}
          </p>
        </section>

        {/* Score Stats Panel */}
        <section className="score-panel" data-od-id="score-summary">
          <div className="score-stat">
            <strong className="num">
              {correctCount} / {totalQuestions}
            </strong>
            <span>Correctas</span>
          </div>
          <div className="score-stat">
            <strong className="num">{scorePercentage}%</strong>
            <span>Puntaje</span>
          </div>
          <div className="score-stat">
            <strong className="num">{timeSpentFormatted}</strong>
            <span>Tiempo</span>
          </div>
        </section>

        {/* Breakdown Panel */}
        <section className="panel glass" data-od-id="result-breakdown">
          <div className="row-between" style={{ marginBottom: 6 }}>
            <h2 className="section-label" style={{ margin: 0 }}>Resumen</h2>
            <span
              className="category"
              style={{
                background: isPassed
                  ? 'color-mix(in oklch, var(--success) 16%, transparent)'
                  : 'color-mix(in oklch, var(--danger) 16%, transparent)',
                color: isPassed ? 'var(--success)' : 'var(--danger)',
              }}
            >
              {isPassed ? 'Nivel Aprobado' : 'Requiere Refuerzo'}
            </span>
          </div>

          <div className="review-row">
            <strong>Respuestas correctas</strong>
            <span style={{ color: 'var(--success)', fontWeight: 700 }}>{correctCount}</span>
          </div>

          <div className="review-row">
            <strong>Preguntas por repasar</strong>
            <span style={{ color: wrongCount > 0 ? 'var(--danger)' : 'var(--muted)', fontWeight: 700 }}>
              {wrongCount}
            </span>
          </div>

          <div className="review-row">
            <strong>Preguntas marcadas con duda</strong>
            <span>{flaggedCount > 0 ? `${flaggedCount} marcadas` : 'Ninguna'}</span>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="stack" style={{ marginTop: 20 }} data-od-id="result-actions">
          {wrongCount > 0 && (
            <Link
              href="/errores"
              onClick={() => soundFx.playClick()}
              className="action"
            >
              Repasar las {wrongCount} falladas
            </Link>
          )}

          <Link
            href="/simulacro-intro"
            onClick={() => {
              soundFx.playClick();
              resetExam();
            }}
            className="action secondary"
          >
            Nuevo simulacro
          </Link>

          <Link
            href="/"
            onClick={() => {
              soundFx.playClick();
              resetExam();
            }}
            className="action secondary"
          >
            Volver al inicio
          </Link>
        </section>
      </main>
    </div>
  );
};
