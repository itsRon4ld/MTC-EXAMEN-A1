'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CodexFilterType = 'all' | 'images' | 'favorites';

interface CodexState {
  searchTerm: string;
  activeFilter: CodexFilterType;
  favorites: Record<number, boolean>; // questionId -> boolean

  // Actions
  setSearchTerm: (term: string) => void;
  setActiveFilter: (filter: CodexFilterType) => void;
  toggleFavorite: (questionId: number) => void;
  isFavorite: (questionId: number) => boolean;
}

export const useCodexStore = create<CodexState>()(
  persist(
    (set, get) => ({
      searchTerm: '',
      activeFilter: 'all',
      favorites: {},

      setSearchTerm: (term: string) => set({ searchTerm: term }),
      setActiveFilter: (filter: CodexFilterType) => set({ activeFilter: filter }),
      toggleFavorite: (questionId: number) => {
        const favorites = { ...get().favorites };
        if (favorites[questionId]) {
          delete favorites[questionId];
        } else {
          favorites[questionId] = true;
        }
        set({ favorites });
      },
      isFavorite: (questionId: number) => !!get().favorites[questionId],
    }),
    {
      name: 'mtc-codex-storage',
    }
  )
);
