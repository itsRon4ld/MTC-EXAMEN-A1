import { Elysia, t } from 'elysia';
import { ResponseFactory } from '@/lib/common/responses';
import { StreakDomainService } from '../domain/Streak';

export const streakApi = new Elysia({ prefix: '/streak' })
  .get('/status', () => {
    const today = StreakDomainService.getTodayString();
    return ResponseFactory.success({
      today,
      serverTime: new Date().toISOString(),
    });
  })
  .post(
    '/calculate',
    ({ body }) => {
      const result = StreakDomainService.calculateStreak(
        body.currentStreak,
        body.bestStreak,
        body.lastActiveDate || null
      );
      return ResponseFactory.success(result);
    },
    {
      body: t.Object({
        currentStreak: t.Number(),
        bestStreak: t.Number(),
        lastActiveDate: t.Optional(t.String()),
      }),
    }
  );
