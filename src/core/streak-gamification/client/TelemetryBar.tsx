'use client';

import React from 'react';
import { useStreakStore } from './useStreakStore';
import { StreakDomainService } from '../domain/Streak';

export const TelemetryBar: React.FC = () => {
  const currentStreak = useStreakStore((s) => s.currentStreak);
  const levelXp = useStreakStore((s) => s.levelXp);
  const { level, title, progressPct } = StreakDomainService.calculateLevel(levelXp);

  return (
    <section className="telemetry" data-od-id="telemetry" aria-label="Progreso del conductor">
      {/* Streak Chip */}
      <div className="telemetry-chip streak">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M13.5 2s.5 4-2 6.5C9.1 10.9 9 14 11.2 15.7c-.2-2.2 1.1-3.6 2.3-4.7.6 2.5 3.5 3.3 3.5 6.2A5 5 0 0 1 7 17c0-4.9 3.2-7.2 6.5-15Z" />
        </svg>
        <span className="num">{currentStreak}</span>
      </div>

      {/* Level Copy and Bar */}
      <div className="level-copy">
        <strong>
          Nivel {level} · {title}
        </strong>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* Lives Chip */}
      <div className="telemetry-chip lives">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 21s-8-4.8-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.2-8 11-8 11Z" />
        </svg>
        <span className="num">3</span>
      </div>
    </section>
  );
};
