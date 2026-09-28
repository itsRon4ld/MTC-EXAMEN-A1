'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ExamQuestion, ExamResult, ExamDomainService, EXAM_CONSTANTS } from '../domain/ExamSession';

interface ExamState {
  questions: ExamQuestion[];
  currentIndex: number;
  userAnswers: Record<number, string>; // questionId -> 'A' | 'B' | 'C' | 'D'
  flaggedQuestions: Record<number, boolean>; // questionId -> boolean
  timeRemainingSeconds: number;
  status: 'idle' | 'in_progress' | 'completed';
  result: ExamResult | null;

  // Actions
  initExam: (questions: ExamQuestion[]) => void;
  selectAnswer: (questionId: number, answerKey: string) => void;
  toggleFlag: (questionId: number) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  tickTimer: () => void;
  submitExam: () => ExamResult;
  resetExam: () => void;
}

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      questions: [],
      currentIndex: 0,
      userAnswers: {},
      flaggedQuestions: {},
      timeRemainingSeconds: EXAM_CONSTANTS.TIME_LIMIT_SECONDS,
      status: 'idle',
      result: null,

      initExam: (questions: ExamQuestion[]) => {
        set({
          questions,
          currentIndex: 0,
          userAnswers: {},
          flaggedQuestions: {},
          timeRemainingSeconds: EXAM_CONSTANTS.TIME_LIMIT_SECONDS,
          status: 'in_progress',
          result: null,
        });
      },

      selectAnswer: (questionId: number, answerKey: string) => {
        const userAnswers = { ...get().userAnswers, [questionId]: answerKey };
        set({ userAnswers });
      },

      toggleFlag: (questionId: number) => {
        const flaggedQuestions = { ...get().flaggedQuestions };
        if (flaggedQuestions[questionId]) {
          delete flaggedQuestions[questionId];
        } else {
          flaggedQuestions[questionId] = true;
        }
        set({ flaggedQuestions });
      },

      goToQuestion: (index: number) => {
        const { questions } = get();
        if (index >= 0 && index < questions.length) {
          set({ currentIndex: index });
        }
      },

      nextQuestion: () => {
        const { currentIndex, questions } = get();
        if (currentIndex < questions.length - 1) {
          set({ currentIndex: currentIndex + 1 });
        }
      },

      prevQuestion: () => {
        const { currentIndex } = get();
        if (currentIndex > 0) {
          set({ currentIndex: currentIndex - 1 });
        }
      },

      tickTimer: () => {
        const { timeRemainingSeconds, status, submitExam } = get();
        if (status !== 'in_progress') return;

        if (timeRemainingSeconds <= 1) {
          // Time expired, auto submit
          submitExam();
        } else {
          set({ timeRemainingSeconds: timeRemainingSeconds - 1 });
        }
      },

      submitExam: () => {
        const { questions, userAnswers, flaggedQuestions, timeRemainingSeconds } = get();
        const timeSpentSeconds = EXAM_CONSTANTS.TIME_LIMIT_SECONDS - timeRemainingSeconds;

        const result = ExamDomainService.calculateResult(
          questions,
          userAnswers,
          flaggedQuestions,
          timeSpentSeconds
        );

        set({
          status: 'completed',
          result,
        });

        return result;
      },

      resetExam: () => {
        set({
          questions: [],
          currentIndex: 0,
          userAnswers: {},
          flaggedQuestions: {},
          timeRemainingSeconds: EXAM_CONSTANTS.TIME_LIMIT_SECONDS,
          status: 'idle',
          result: null,
        });
      },
    }),
    {
      name: 'mtc-official-exam-session',
    }
  )
);
