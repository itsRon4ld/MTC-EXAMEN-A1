'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { TelemetryBar } from './TelemetryBar';
import { DailyGoalRing } from './DailyGoalRing';
import { useStreakStore } from './useStreakStore';
import { useErrorBankStore } from '@/core/error-bank/client/useErrorBankStore';
import { soundFx } from '@/core/shared/client/AudioSynthesizer';
import { useSession } from '@/core/auth/client/authClient';

export const DashboardView: React.FC = () => {
  const { data: session } = useSession();
  const resetDaily = useStreakStore((s) => s.resetDailyCountIfNeeded);
  const errorCount = useErrorBankStore((s) => Object.keys(s.errors).length);

  useEffect(() => {
    resetDaily();
  }, [resetDaily]);

  const userName = session?.user?.name || 'Conductor';
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <main className="app-main">
      {/* Header */}
      <header className="screen-head" data-od-id="dashboard-header">
        <div>
          <div className="screen-kicker">MTC-EXAM A-1</div>
          <h1 className="screen-title">Hola, {userName}.</h1>
        </div>
        <Link
          href={session ? '/perfil' : '/login'}
          onClick={() => soundFx.playClick()}
          className="profile-dot"
          aria-label="Abrir perfil o iniciar sesión"
        >
          {userInitials || 'RM'}
        </Link>
      </header>

      {/* Telemetry Bar (Streak, Level, Lives) */}
      <TelemetryBar />

      {/* Daily Goal Card */}
      <DailyGoalRing />

      {/* Study Modes List */}
      <section data-od-id="study-modes">
        <h2 className="section-label">¿Cómo quieres practicar?</h2>
        <div className="mode-list">
          {/* Mode 1: Entrenamiento Inteligente */}
          <Link
            href="/quiz"
            onClick={() => soundFx.playClick()}
            className="mode-card glass featured"
          >
            <span className="mode-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="m13 2-8 12h6l-1 8 9-13h-6V2Z" />
              </svg>
            </span>
            <span className="mode-copy">
              <strong>Entrenamiento inteligente</strong>
              <span>Domina las 200 preguntas oficiales y señales.</span>
            </span>
            <span className="chev">›</span>
          </Link>

          {/* Mode 2: Simulacro Oficial MTC */}
          <Link
            href="/simulacro-intro"
            onClick={() => soundFx.playClick()}
            className="mode-card glass"
          >
            <span className="mode-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <circle cx="12" cy="13" r="8" />
                <path d="M12 9v4l3 2M9 2h6" />
              </svg>
            </span>
            <span className="mode-copy">
              <strong>Simulacro oficial MTC</strong>
              <span>50 preguntas al azar · 40 minutos · Aprueba con 40.</span>
            </span>
            <span className="chev">›</span>
          </Link>

          {/* Mode 3: Banco de Errores */}
          <Link
            href="/errores"
            onClick={() => soundFx.playClick()}
            className="mode-card glass"
          >
            <span className="mode-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M8 5H4v15h16V5h-4M9 4h6v4H9zM8 13h8M8 17h5" />
              </svg>
            </span>
            <span className="mode-copy">
              <strong>Banco de errores</strong>
              <span>Refuerza tus puntos débiles hasta dominarlos.</span>
            </span>
            {errorCount > 0 ? (
              <span className="badge">{errorCount}</span>
            ) : (
              <span className="chev">›</span>
            )}
          </Link>

          {/* Mode 4: Modo Supervivencia */}
          <Link
            href="/quiz"
            onClick={() => soundFx.playClick()}
            className="mode-card glass"
          >
            <span className="mode-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M12 3v18M3 12h18M6 6l12 12M18 6 6 18" />
              </svg>
            </span>
            <span className="mode-copy">
              <strong>Modo supervivencia</strong>
              <span>3 vidas · Responde sin fallar para superar tu récord.</span>
            </span>
            <span className="chev">›</span>
          </Link>
        </div>
      </section>
    </main>
  );
};
