'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StreakDomainService } from '../domain/Streak';

interface StreakState {
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string | null;
  dailyGoalTarget: number;
  dailyAnsweredCount: number;
  levelXp: number;
  totalAnswered: number;

  // Actions
  recordActivity: (isCorrect: boolean) => void;
  setDailyGoalTarget: (target: number) => void;
  resetDailyCountIfNeeded: () => void;
}

export const useStreakStore = create<StreakState>()(
  persist(
    (set, get) => ({
      currentStreak: 5,
      bestStreak: 7,
      lastActiveDate: null,
      dailyGoalTarget: 25,
      dailyAnsweredCount: 15,
      levelXp: 350,
      totalAnswered: 48,

      recordActivity: (isCorrect: boolean) => {
        const state = get();
        const today = StreakDomainService.getTodayString();

        const { newStreak, newBest } = StreakDomainService.calculateStreak(
          state.currentStreak,
          state.bestStreak,
          state.lastActiveDate
        );

        const isSameDay = state.lastActiveDate === today;
        const newDailyCount = isSameDay ? state.dailyAnsweredCount + 1 : 1;
        const xpEarned = isCorrect ? 10 : 2;

        set({
          currentStreak: newStreak,
          bestStreak: newBest,
          lastActiveDate: today,
          dailyAnsweredCount: newDailyCount,
          totalAnswered: state.totalAnswered + 1,
          levelXp: state.levelXp + xpEarned,
        });
      },

      setDailyGoalTarget: (target: number) => {
        set({ dailyGoalTarget: target });
      },

      resetDailyCountIfNeeded: () => {
        const state = get();
        const today = StreakDomainService.getTodayString();
        if (state.lastActiveDate !== today) {
          set({ dailyAnsweredCount: 0 });
        }
      },
    }),
    {
      name: 'mtc-user-streak-storage',
    }
  )
);
