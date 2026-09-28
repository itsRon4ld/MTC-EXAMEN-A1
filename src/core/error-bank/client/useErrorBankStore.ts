'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ErrorEntry, ErrorBankDomainService } from '../domain/ErrorEntry';

interface ErrorBankState {
  errors: Record<number, ErrorEntry>; // questionId -> ErrorEntry

  // Actions
  addError: (questionId: number) => void;
  resolveError: (questionId: number) => void;
  getErrorQuestionIds: () => number[];
  clearAllErrors: () => void;
}

export const useErrorBankStore = create<ErrorBankState>()(
  persist(
    (set, get) => ({
      errors: {},

      addError: (questionId: number) => {
        const errors = { ...get().errors };
        const existing = errors[questionId];

        if (existing) {
          errors[questionId] = {
            ...existing,
            timesFailed: existing.timesFailed + 1,
            consecutiveCorrect: 0,
            lastFailedAt: new Date().toISOString(),
          };
        } else {
          errors[questionId] = {
            questionId,
            timesFailed: 1,
            consecutiveCorrect: 0,
            lastFailedAt: new Date().toISOString(),
          };
        }

        set({ errors });
      },

      resolveError: (questionId: number) => {
        const errors = { ...get().errors };
        const existing = errors[questionId];

        if (existing) {
          const updated = {
            ...existing,
            consecutiveCorrect: existing.consecutiveCorrect + 1,
          };

          if (ErrorBankDomainService.shouldRemoveFromBank(updated)) {
            delete errors[questionId];
          } else {
            errors[questionId] = updated;
          }

          set({ errors });
        }
      },

      getErrorQuestionIds: () => {
        return Object.keys(get().errors).map(Number);
      },

      clearAllErrors: () => {
        set({ errors: {} });
      },
    }),
    {
      name: 'mtc-error-bank-storage',
    }
  )
);
