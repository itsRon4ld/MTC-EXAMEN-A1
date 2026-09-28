'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from '@/core/auth/client/authClient';
import { useStreakStore } from '@/core/streak-gamification/client/useStreakStore';
import { useErrorBankStore } from '@/core/error-bank/client/useErrorBankStore';
import { StreakDomainService } from '@/core/streak-gamification/domain/Streak';
import { AchievementDomainService } from '../domain/Achievement';
import { soundFx } from '@/core/shared/client/AudioSynthesizer';

export const PerfilView: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    currentStreak,
    bestStreak,
    dailyAnsweredCount,
    dailyGoalTarget,
    levelXp,
    totalAnswered,
    setDailyGoalTarget,
  } = useStreakStore();

  const errorCount = useErrorBankStore((s) => Object.keys(s.errors).length);
  const masteredCount = Math.max(0, 200 - errorCount);
  const masteredPct = Math.min(100, Math.round((masteredCount / 200) * 100));

  const { level, title, progressPct } =
    StreakDomainService.calculateLevel(levelXp);

  const achievements = AchievementDomainService.getAchievements(
    totalAnswered,
    currentStreak,
    levelXp,
    masteredCount
  );

  const [showGoalModal, setShowGoalModal] = useState(false);

  const userName = session?.user?.name || 'Conductor en práctica';
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleSignOut = async () => {
    soundFx.playClick();
    await signOut();
    router.push('/login');
  };

  const handleSelectGoal = (target: number) => {
    soundFx.playClick();
    setDailyGoalTarget(target);
    setShowGoalModal(false);
  };

  return (
    <main className="app-main" style={{ paddingBottom: 120 }}>
      {/* Header */}
      <header className="screen-head" data-od-id="profile-header">
        <div>
          <div className="screen-kicker">Mi progreso</div>
          <h1 className="screen-title">Perfil</h1>
        </div>
        <button
          type="button"
          className="icon-btn"
          onClick={() => {
            soundFx.playClick();
            setShowGoalModal(true);
          }}
          aria-label="Configurar meta diaria"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.86 2.86-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9.6v-.1A1.7 1.7 0 0 0 8.5 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.86-2.86.06-.06A1.7 1.7 0 0 0 4.1 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H2V9.6h.4A1.7 1.7 0 0 0 4.1 8.5a1.7 1.7 0 0 0-.34-1.88l-.06-.06L6.56 3.7l.06.06A1.7 1.7 0 0 0 8.5 4.1a1.7 1.7 0 0 0 1-.6A1.7 1.7 0 0 0 9.9 2h4.2a1.7 1.7 0 0 0 .4 1.5 1.7 1.7 0 0 0 1 .6 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.86 2.86-.06.06A1.7 1.7 0 0 0 19.9 8.5a1.7 1.7 0 0 0 .6 1 1.7 1.7 0 0 0 1.1.4H22v4.2h-.4a1.7 1.7 0 0 0-1.1.4 1.7 1.7 0 0 0-.6 1Z" />
          </svg>
        </button>
      </header>

      {/* Profile Hero */}
      <section className="profile-hero" data-od-id="driver-profile">
        <div className="avatar">{userInitials || 'RM'}</div>
        <h1>{userName}</h1>
        <p>
          Nivel {level} · {title} · {progressPct}% del nivel
        </p>
      </section>

      {/* Mini Stats Grid */}
      <section className="stat-grid" data-od-id="profile-stats">
        <div className="mini-stat glass">
          <strong className="num" style={{ color: 'var(--warn)' }}>
            {currentStreak}
          </strong>
          <span>Días de racha</span>
        </div>
        <div className="mini-stat glass">
          <strong className="num">{dailyAnsweredCount}</strong>
          <span>Hoy / {dailyGoalTarget}</span>
        </div>
        <div className="mini-stat glass">
          <strong className="num">{bestStreak}</strong>
          <span>Récord racha</span>
        </div>
      </section>

      {/* Study Progress (200 Questions Mastery) */}
      <section className="panel glass" data-od-id="study-progress" style={{ marginBottom: 16 }}>
        <div className="row-between" style={{ marginBottom: 12 }}>
          <h2 className="section-label" style={{ margin: 0 }}>
            Dominio del balotario
          </h2>
          <span className="micro num">
            {masteredCount} / 200
          </span>
        </div>
        <div className="progress-track" style={{ height: 10 }}>
          <div className="progress-fill" style={{ width: `${masteredPct}%` }} />
        </div>
        <div className="row-between" style={{ marginTop: 10 }}>
          <p className="muted" style={{ fontSize: 12, margin: 0 }}>
            {errorCount > 0
              ? `${errorCount} preguntas por reforzar en el Banco de Errores.`
              : '¡Felicidades! Tienes todo el balotario en estado dominado.'}
          </p>
          <span className="num" style={{ fontSize: 12, color: 'var(--success)', fontWeight: 700 }}>
            {masteredPct}%
          </span>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="panel glass" data-od-id="achievements" style={{ marginBottom: 20 }}>
        <div className="row-between" style={{ marginBottom: 8 }}>
          <h2 className="section-label" style={{ margin: 0 }}>
            Logros de Conductor
          </h2>
          <span className="micro">
            {achievements.filter((a) => a.unlocked).length} / {achievements.length} desbloqueados
          </span>
        </div>

        {achievements.map((item) => (
          <div key={item.id} className="achievement" style={{ opacity: item.unlocked ? 1 : 0.55 }}>
            <span
              className="achievement-icon"
              style={{
                background: item.unlocked
                  ? 'color-mix(in oklch, var(--warn) 20%, transparent)'
                  : 'color-mix(in oklch, var(--accent-on) 6%, transparent)',
                color: item.unlocked ? 'var(--warn)' : 'var(--muted)',
              }}
            >
              {item.iconType === 'trophy' && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v2a4 4 0 0 0 4 4M17 6h3v2a4 4 0 0 1-4 4" />
                </svg>
              )}
              {item.iconType === 'fire' && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M13.5 2s.5 4-2 6.5C9.1 10.9 9 14 11.2 15.7c-.2-2.2 1.1-3.6 2.3-4.7.6 2.5 3.5 3.3 3.5 6.2A5 5 0 0 1 7 17c0-4.9 3.2-7.2 6.5-15Z" />
                </svg>
              )}
              {item.iconType === 'star' && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              )}
              {item.iconType === 'crown' && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
                </svg>
              )}
            </span>
            <span style={{ flex: 1 }}>
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </span>
            <span className="micro" style={{ color: item.unlocked ? 'var(--success)' : 'var(--muted)' }}>
              {item.unlocked ? '✅ Desbloqueado' : item.progressText}
            </span>
          </div>
        ))}
      </section>

      {/* Account / Session Management */}
      <section className="panel glass stack" data-od-id="account-actions">
        <h2 className="section-label" style={{ margin: 0 }}>
          Cuenta y Sesión
        </h2>
        {session ? (
          <>
            <div className="review-row">
              <strong>Correo electrónico</strong>
              <span>{session.user.email}</span>
            </div>
            <button
              type="button"
              className="action secondary"
              onClick={handleSignOut}
              style={{ color: 'var(--danger)', borderColor: 'color-mix(in oklch, var(--danger) 40%, transparent)' }}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <Link
            href="/login"
            onClick={() => soundFx.playClick()}
            className="action"
          >
            Iniciar sesión o Crear cuenta
          </Link>
        )}
      </section>

      {/* Daily Goal Config Modal */}
      {showGoalModal && (
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
          <div className="panel glass" style={{ maxWidth: 360, width: '100%', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, margin: '0 0 8px' }}>
              Configurar Meta Diaria
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 20 }}>
              ¿Cuántas preguntas deseas responder al día para mantener tu racha?
            </p>

            <div className="stack" style={{ gap: 10, marginBottom: 16 }}>
              {[15, 25, 50].map((goal) => (
                <button
                  key={goal}
                  type="button"
                  className={`action ${dailyGoalTarget === goal ? '' : 'secondary'}`}
                  onClick={() => handleSelectGoal(goal)}
                >
                  {goal} preguntas / día {dailyGoalTarget === goal ? '✓' : ''}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="action secondary"
              onClick={() => {
                soundFx.playClick();
                setShowGoalModal(false);
              }}
              style={{ fontSize: 13 }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
