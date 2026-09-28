'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useExamStore } from './useExamStore';
import { soundFx } from '@/core/shared/client/AudioSynthesizer';
import { ExamQuestion } from '../domain/ExamSession';

export const SimulacroIntroView: React.FC = () => {
  const router = useRouter();
  const initExam = useExamStore((s) => s.initExam);
  const [loading, setLoading] = useState(false);

  const handleStartExam = async () => {
    soundFx.playClick();
    setLoading(true);

    try {
      // Fetch fresh 50 questions
      const res = await fetch('/data/balotario-200.json');
      const allQuestions = await res.json();
      
      // Shuffle & pick 50
      const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
      const selected: ExamQuestion[] = shuffled.slice(0, 50).map((q, idx) => ({
        ...q,
        index: idx + 1,
      }));

      initExam(selected);
      router.push('/simulacro');
    } catch (err) {
      console.error('Error starting exam:', err);
      setLoading(false);
    }
  };

  return (
    <main className="app-main">
      {/* Header */}
      <header className="screen-head" data-od-id="simulacro-intro-header">
        <Link
          href="/"
          onClick={() => soundFx.playClick()}
          className="icon-btn"
          aria-label="Volver al inicio"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>
        <span className="screen-kicker">Simulacro Oficial</span>
        <span style={{ width: 44 }}></span>
      </header>

      {/* Main Card */}
      <section className="panel glass" style={{ textAlign: 'center', padding: '32px 20px', marginBottom: 20 }}>
        <div
          style={{
            width: 72,
            height: 72,
            margin: '0 auto 16px',
            borderRadius: '50%',
            background: 'color-mix(in oklch, var(--warn) 18%, transparent)',
            border: '1px solid color-mix(in oklch, var(--warn) 45%, transparent)',
            display: 'grid',
            placeItems: 'center',
            color: 'var(--warn)',
          }}
        >
          <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="13" r="8" />
            <path d="M12 9v4l3 2M9 2h6" />
          </svg>
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 300, margin: '0 0 8px' }}>
          Simulacro Tipo Examen
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 'var(--text-sm)', margin: 0 }}>
          Replica con exactitud las condiciones oficiales del examen de reglas de tránsito del MTC.
        </p>
      </section>

      {/* Rules Breakdown */}
      <section className="panel glass stack" style={{ marginBottom: 24 }}>
        <h2 className="section-label" style={{ margin: 0 }}>Reglas de evaluación</h2>

        <div className="review-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: 'var(--success)' }}>📝</span>
            <strong>Cantidad de preguntas</strong>
          </div>
          <span className="num" style={{ color: 'var(--accent-on)', fontWeight: 700 }}>50 preguntas</span>
        </div>

        <div className="review-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: 'var(--warn)' }}>⏱️</span>
            <strong>Tiempo límite</strong>
          </div>
          <span className="num" style={{ color: 'var(--warn)', fontWeight: 700 }}>40 minutos</span>
        </div>

        <div className="review-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: 'var(--success)' }}>🎯</span>
            <strong>Puntaje mínimo de aprobación</strong>
          </div>
          <span className="num" style={{ color: 'var(--success)', fontWeight: 700 }}>40 / 50 (80%)</span>
        </div>

        <div className="review-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: 'var(--warn)' }}>🚩</span>
            <strong>Navegación libre y banderas</strong>
          </div>
          <span style={{ color: 'var(--muted)', fontSize: 12 }}>Disponible</span>
        </div>
      </section>

      {/* Action CTA */}
      <button
        type="button"
        className="action"
        onClick={handleStartExam}
        disabled={loading}
      >
        {loading ? 'Preparando examen...' : 'Comenzar simulacro'}
      </button>
    </main>
  );
};
