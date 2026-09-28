import { pgTable, text, integer, timestamp, boolean, varchar, jsonb } from 'drizzle-orm/pg-core';

// ==========================================
// 1. TABLAS DE AUTENTICACIÓN (Better Auth)
// ==========================================

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ==========================================
// 2. TABLAS DEL DOMINIO MTC A-1
// ==========================================

export const questions = pgTable('questions', {
  id: integer('id').primaryKey(),
  code: varchar('code', { length: 20 }),
  category: text('category').notNull(),
  prompt: text('prompt').notNull(),
  mediaUrl: text('media_url'),
  options: jsonb('options').notNull(), // Array de { key: string, text: string }
  correctAnswer: varchar('correct_answer', { length: 1 }).notNull(), // 'a' | 'b' | 'c' | 'd'
  explanation: text('explanation'),
});

export const userProgress = pgTable('user_progress', {
  userId: text('user_id').primaryKey().references(() => user.id, { onDelete: 'cascade' }),
  currentStreak: integer('current_streak').default(0).notNull(),
  bestStreak: integer('best_streak').default(0).notNull(),
  lastActiveDate: varchar('last_active_date', { length: 10 }), // Formato YYYY-MM-DD
  dailyGoalTarget: integer('daily_goal_target').default(25).notNull(),
  dailyAnsweredCount: integer('daily_answered_count').default(0).notNull(),
  levelXp: integer('level_xp').default(0).notNull(),
  totalAnswered: integer('total_answered').default(0).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const errorBank = pgTable('error_bank', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  questionId: integer('question_id').notNull().references(() => questions.id),
  timesFailed: integer('times_failed').default(1).notNull(),
  consecutiveCorrect: integer('consecutive_correct').default(0).notNull(),
  lastFailedAt: timestamp('last_failed_at').defaultNow().notNull(),
});

export const examHistory = pgTable('exam_history', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  score: integer('score').notNull(), // Aciertos sobre 50
  percentage: integer('percentage').notNull(), // % de acierto
  isPassed: boolean('is_passed').notNull(), // true si score >= 40
  durationSeconds: integer('duration_seconds').notNull(),
  flaggedCount: integer('flagged_count').default(0).notNull(),
  completedAt: timestamp('completed_at').defaultNow().notNull(),
});
