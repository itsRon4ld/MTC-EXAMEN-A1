'use client';

import React from 'react';
import { useStreakStore } from './useStreakStore';

export const DailyGoalRing: React.FC = () => {
  const dailyAnsweredCount = useStreakStore((s) => s.dailyAnsweredCount);
  const dailyGoalTarget = useStreakStore((s) => s.dailyGoalTarget);

  const pct = Math.min(100, Math.round((dailyAnsweredCount / dailyGoalTarget) * 100));
  const remaining = Math.max(0, dailyGoalTarget - dailyAnsweredCount);

  return (
    <section className="daily panel glass" data-od-id="daily-goal">
      <div
        className="progress-ring"
        style={{
          background: `conic-gradient(var(--success) 0 ${pct}%, color-mix(in oklch, var(--accent-on) 10%, transparent) ${pct}%)`,
        }}
      >
        <span>{pct}%</span>
      </div>
      <div>
        <p className="micro">Meta diaria</p>
        <h2>
          <span className="num">
            {dailyAnsweredCount} / {dailyGoalTarget}
          </span>{' '}
          preguntas
        </h2>
        <p className="muted">
          {remaining === 0
            ? '¡Completaste tu meta del día! 🎉'
            : `Te faltan ${remaining} para cerrar el día.`}
        </p>
      </div>
    </section>
  );
};
