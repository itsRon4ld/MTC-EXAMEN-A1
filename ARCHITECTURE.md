# BLUEPRINT DE ARQUITECTURA & ESPECIFICACIONES TÉCNICAS
## App Móvil MTC A-1 (Balotario Oficial de Conducir - Perú)

Este documento contiene el mapeo arquitectónico, tecnológico y de diseño de la aplicación para referencia futura.

---

## 1. Stack Tecnológico

| Capa | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Framework Fullstack** | **Next.js (App Router)** | Renderizado híbrido (SSR/Client), rutas y bundling optimizado. |
| **Autenticación** | **Better Auth** (`better-auth`) | Auth nativa con Drizzle Adapter en Neon. Flujo simple: Nombre, Email y Password. |
| **Base de Datos** | **Neon Postgres** | Base de datos PostgreSQL serverless en la nube, con latencia mínima y branching. |
| **ORM & Migraciones** | **Drizzle ORM** + **Drizzle Kit** | Tipado estricto extremo a extremo, mapeo SQL directo a entidades DDD sin sobrecarga. |
| **Capa de APIs & Tipado E2E** | **ElysiaJS** + **Eden Treaty** | Servidor de APIs de alta velocidad montado en Next.js con autocompletado total en cliente. |
| **Estado Cliente & Caché** | **TanStack Query** + **Zustand** | Caché reactiva, mutaciones optimistas en 0ms y gestión de estado local. |
| **Diseño & UI/UX** | **Vanilla CSS + Tokens OKLCH** | Inspirado en `Web-Prototype/screens/app.css` (Glassmorphism, Dark Obsidian, botones 3D). |
| **Audio & Hápticos** | **Web Audio API** | Efectos de sonido sintetizados en el navegador (100% offline, cero latencia). |
| **Micro-interacciones** | **Canvas Confetti** | Efectos visuales al aprobar simulacros o alcanzar metas de racha. |
| **Mobile / PWA** | **Web App Manifest + SW** | Instalable como aplicación móvil nativa a pantalla completa en Android e iOS. |

---

## 2. Arquitectura: Vertical Slice Architecture + DDD

Toda la lógica de negocio y las funcionalidades residen dentro del directorio **`src/core/`**, estructuradas por **Feature**. Cada feature encapsula sus propias tres capas: **`domain`**, **`server`** y **`client`**.

```
src/
├── lib/
│   └── common/
│       └── responses/                            # 🛡️ Errores y respuestas centralizados
│           ├── apiResponse.ts                    # Formato ApiResponse<T>
│           ├── errorCodes.ts                     # Diccionario de códigos de error
│           └── appError.ts                       # Clase base AppError
│
├── core/                                         # 🏛️ Directorio raíz de features
│   ├── auth/                                     # Autenticación (Better Auth)
│   │   ├── domain/                               # UserProfile, Credentials
│   │   ├── server/                               # auth.ts (Better Auth config con Drizzle)
│   │   └── client/                               # AuthModal / LoginView, useAuth
│   │
│   ├── streak-gamification/                      # Racha, Telemetría y Dashboard
│   │   ├── domain/                               # Streak (VO), DailyGoal (Entity), LevelXP (VO)
│   │   ├── server/                               # streakActions.ts, api.ts (Elysia)
│   │   └── client/                               # DashboardView, TelemetryBar, DailyGoalRing
│   │
│   ├── training-quiz/                            # Preguntas y Feedback
│   │   ├── domain/                               # Question (Entity), Alternative, AnswerAttempt
│   │   ├── server/                               # quizQueries.ts, api.ts (Elysia)
│   │   └── client/                               # QuizView, FeedbackSheet, useTrainingStore
│   │
│   ├── official-exam/                            # Simulacro Oficial 50 MTC
│   │   ├── domain/                               # ExamSession (Aggregate), ScorePolicy (≥40)
│   │   ├── server/                               # examActions.ts, api.ts (Elysia)
│   │   └── client/                               # SimulacroView, ResultadosView, GridNavigator
│   │
│   ├── error-bank/                               # Banco de Puntos Débiles
│   │   ├── domain/                               # ErrorEntry, RepetitionQueue
│   │   ├── server/                               # errorActions.ts, api.ts (Elysia)
│   │   └── client/                               # ErroresView, useErrorBankStore
│   │
│   ├── question-codex/                           # Balotario 200 & Buscador
│   │   ├── domain/                               # CodexFilter, Bookmark
│   │   ├── server/                               # codexQueries.ts, api.ts (Elysia)
│   │   └── client/                               # BalotarioView, useCodexStore
│   │
│   ├── pilot-profile/                            # Perfil de Conductor y Medallas
│   │   ├── domain/                               # PilotProfile, Achievement
│   │   ├── server/                               # profileActions.ts
│   │   └── client/                               # PerfilView
│   │
│   └── shared/                                   # Transversal en core
│       ├── domain/                               # Result<T>, Entity, ValueObject base
│       ├── server/                               # db.ts (Neon + Drizzle), schema.ts, elysiaRoot.ts
│       └── client/                               # AppShell, BottomNav, QueryClientProvider, Audio, app.css
│
└── app/                                          # 🚀 Next.js App Router (Solo enrutador delgado)
    ├── layout.tsx                                # AppShell + Viewport móvil + app.css
    ├── page.tsx                                  # Importa DashboardView
    ├── login/page.tsx                            # Pantalla de Login / Registro
    ├── quiz/page.tsx                             # Importa QuizView
    ├── simulacro/page.tsx                        # Importa SimulacroView
    ├── resultados/page.tsx                       # Importa ResultadosView
    ├── errores/page.tsx                          # Importa ErroresView
    ├── balotario/page.tsx                        # Importa BalotarioView
    ├── perfil/page.tsx                           # Importa PerfilView
    └── api/
        ├── auth/[...all]/route.ts                # Route Handler de Better Auth
        └── [[...slugs]]/route.ts                 # Route Handler de ElysiaJS
```

---

## 3. Modelo de Datos Drizzle (Neon Postgres)

```typescript
// Tablas de Better Auth:
user (id, name, email, email_verified, image, created_at, updated_at)
session (id, user_id, token, expires_at, ip_address, user_agent)
account (id, user_id, account_id, provider_id, password)
verification (id, identifier, value, expires_at)

// Tablas del Negocio MTC:
questions (id, code, category, prompt, media_url, options, correct_answer, explanation)
user_progress (user_id, current_streak, best_streak, last_active_date, daily_goal_target, level_xp, total_answered)
error_bank (id, user_id, question_id, times_failed, consecutive_correct, last_failed_at)
exam_history (id, user_id, score, percentage, is_passed, duration_seconds, completed_at)
```

---

## 4. Sistema de Diseño UI/UX

* **Estética**: *Obsidian Dark & Cyber Emerald*.
* **Paleta**:
  - Fondo Base: `#000000` / `#070B0E`.
  - Superficies Glass: `color-mix(in oklch, var(--accent-on) 7%, transparent)` con borde fino y desenfoque `backdrop-filter: blur(18px)`.
  - Verde Acento & Éxito: `#16a34a` / `#00F59B`.
  - Racha / Alerta: `#eab308` (Ámbar) y `#dc2626` (Rojo Vidas/Fallos).
* **Sensación Táctil**:
  - Botones con relieve 3D (`box-shadow: 0 6px 0 ...`).
  - Pulsación mecánica (`active: translateY(5px)`).
  - Feedback sonoro sintético y vibración háptica al responder.
  - Diseño optimizado para uso con una sola mano (pulgar).

---

## 5. Seguimiento de Tareas y Fases
Para consultar el checklist completo de fases y tarjetas de trabajo, consulta:
📄 **[ROADMAP.md](file:///C:/Users/RONALD/Documents/Personal/ROADMAP.md)**

