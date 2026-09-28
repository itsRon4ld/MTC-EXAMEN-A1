-- =========================================================
-- MTC-EXAM A-1 · Script de Creación de Tablas (Postgres / Neon)
-- =========================================================

-- 1. Tabla de Usuarios
CREATE TABLE IF NOT EXISTS "user" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "email_verified" BOOLEAN NOT NULL DEFAULT FALSE,
  "image" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 2. Tabla de Sesiones
CREATE TABLE IF NOT EXISTS "session" (
  "id" TEXT PRIMARY KEY,
  "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "token" TEXT NOT NULL UNIQUE,
  "expires_at" TIMESTAMP NOT NULL,
  "ip_address" TEXT,
  "user_agent" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 3. Tabla de Cuentas (Credenciales y Proveedores)
CREATE TABLE IF NOT EXISTS "account" (
  "id" TEXT PRIMARY KEY,
  "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "account_id" TEXT NOT NULL,
  "provider_id" TEXT NOT NULL,
  "access_token" TEXT,
  "refresh_token" TEXT,
  "id_token" TEXT,
  "access_token_expires_at" TIMESTAMP,
  "refresh_token_expires_at" TIMESTAMP,
  "scope" TEXT,
  "password" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 4. Tabla de Verificaciones
CREATE TABLE IF NOT EXISTS "verification" (
  "id" TEXT PRIMARY KEY,
  "identifier" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "expires_at" TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- 5. Tabla de Preguntas del Balotario
CREATE TABLE IF NOT EXISTS "questions" (
  "id" INTEGER PRIMARY KEY,
  "code" VARCHAR(20),
  "category" TEXT NOT NULL,
  "prompt" TEXT NOT NULL,
  "media_url" TEXT,
  "options" JSONB NOT NULL,
  "correct_answer" VARCHAR(1) NOT NULL,
  "explanation" TEXT
);

-- 6. Tabla de Telemetría y Progreso de Usuario
CREATE TABLE IF NOT EXISTS "user_progress" (
  "user_id" TEXT PRIMARY KEY REFERENCES "user"("id") ON DELETE CASCADE,
  "current_streak" INTEGER NOT NULL DEFAULT 0,
  "best_streak" INTEGER NOT NULL DEFAULT 0,
  "last_active_date" VARCHAR(10),
  "daily_goal_target" INTEGER NOT NULL DEFAULT 25,
  "daily_answered_count" INTEGER NOT NULL DEFAULT 0,
  "level_xp" INTEGER NOT NULL DEFAULT 0,
  "total_answered" INTEGER NOT NULL DEFAULT 0,
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 7. Tabla del Banco de Errores
CREATE TABLE IF NOT EXISTS "error_bank" (
  "id" TEXT PRIMARY KEY,
  "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "question_id" INTEGER NOT NULL REFERENCES "questions"("id"),
  "times_failed" INTEGER NOT NULL DEFAULT 1,
  "consecutive_correct" INTEGER NOT NULL DEFAULT 0,
  "last_failed_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 8. Tabla de Historial de Simulacros
CREATE TABLE IF NOT EXISTS "exam_history" (
  "id" TEXT PRIMARY KEY,
  "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "score" INTEGER NOT NULL,
  "percentage" INTEGER NOT NULL,
  "is_passed" BOOLEAN NOT NULL,
  "duration_seconds" INTEGER NOT NULL,
  "flagged_count" INTEGER NOT NULL DEFAULT 0,
  "completed_at" TIMESTAMP NOT NULL DEFAULT NOW()
);
