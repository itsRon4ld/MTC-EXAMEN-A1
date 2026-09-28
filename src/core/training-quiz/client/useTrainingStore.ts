'use client';

import { create } from 'zustand';
import { Question, AlternativeKey, QuestionDomainService } from '../domain/Question';
import { soundFx } from '@/core/shared/client/AudioSynthesizer';
import { useStreakStore } from '@/core/streak-gamification/client/useStreakStore';
import { useErrorBankStore } from '@/core/error-bank/client/useErrorBankStore';

interface TrainingState {
  questions: Question[];
  currentIndex: number;
  selectedOption: AlternativeKey | null;
  isAnswered: boolean;
  isCorrect: boolean | null;
  explanation: string;
  lives: number;
  isLoading: boolean;
  
  // Actions
  initQuestions: (questions: Question[]) => void;
  selectOption: (key: AlternativeKey) => void;
  checkAnswer: () => void;
  nextQuestion: () => void;
  resetSession: () => void;
}

export const useTrainingStore = create<TrainingState>((set, get) => ({
  questions: [],
  currentIndex: 0,
  selectedOption: null,
  isAnswered: false,
  isCorrect: null,
  explanation: '',
  lives: 3,
  isLoading: true,

  initQuestions: (questions: Question[]) => {
    set({
      questions,
      currentIndex: 0,
      selectedOption: null,
      isAnswered: false,
      isCorrect: null,
      explanation: '',
      lives: 3,
      isLoading: false,
    });
  },

  selectOption: (key: AlternativeKey) => {
    if (get().isAnswered) return;
    soundFx.playClick();
    set({ selectedOption: key });
  },

  checkAnswer: () => {
    const { questions, currentIndex, selectedOption, isAnswered, lives } = get();
    if (!selectedOption || isAnswered || currentIndex >= questions.length) return;

    const currentQ = questions[currentIndex];
    const evaluation = QuestionDomainService.evaluateAnswer(currentQ, selectedOption);

    if (evaluation.isCorrect) {
      soundFx.playSuccess();
      useStreakStore.getState().recordActivity(true);
      useErrorBankStore.getState().resolveError(currentQ.id);
      set({
        isAnswered: true,
        isCorrect: true,
        explanation: evaluation.explanation,
      });
    } else {
      soundFx.playError();
      useStreakStore.getState().recordActivity(false);
      useErrorBankStore.getState().addError(currentQ.id);
      set({
        isAnswered: true,
        isCorrect: false,
        explanation: evaluation.explanation,
        lives: Math.max(0, lives - 1),
      });
    }
  },

  nextQuestion: () => {
    const { currentIndex, questions } = get();
    soundFx.playClick();
    if (currentIndex + 1 < questions.length) {
      set({
        currentIndex: currentIndex + 1,
        selectedOption: null,
        isAnswered: false,
        isCorrect: null,
        explanation: '',
      });
    } else {
      // Completed all questions in the set, loop or finish
      set({
        currentIndex: 0,
        selectedOption: null,
        isAnswered: false,
        isCorrect: null,
        explanation: '',
      });
    }
  },

  resetSession: () => {
    set({
      currentIndex: 0,
      selectedOption: null,
      isAnswered: false,
      isCorrect: null,
      explanation: '',
      lives: 3,
    });
  },
}));
