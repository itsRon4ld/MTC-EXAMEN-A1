# 🗺️ ROADMAP & CHECKLIST DE IMPLEMENTACIÓN VIVO
## App Móvil MTC A-1 (Balotario Oficial de Conducir - Perú)

> **Estado del Proyecto**: 🏁 Completado al 100%  
> **Progreso Global**: `13 / 13` Tarjetas completadas (`100%`)  
> **Última actualización**: 27/09/2026

*Este documento actúa como el checklist vivo del proyecto. Se irá marcando con `[x]` conforme avancemos en cada fase e implementación.*

---

### 🔹 FASE 1: Datos y Cimientos
- [x] **Tarjeta 1: Extracción del Balotario y Señales (PDF)**
  - [x] Desarrollar script Python para extraer las 200 preguntas completas del PDF.
  - [x] Extraer y recortar las 68 imágenes de señales de tránsito y diagramas de cruces.
  - [x] Generar archivo estructurado `balotario-200.json` con ID, tema, pregunta, opciones (a, b, c, d), respuesta oficial y ruta de imagen.
  - [x] Validar integridad (exactamente 200 preguntas y 68 imágenes asociadas).

- [x] **Tarjeta 2: Setup del Proyecto Next.js y Neon DB**
  - [x] Inicializar proyecto Next.js con TypeScript estricto.
  - [x] Instalar y configurar `drizzle-orm`, `drizzle-kit` y `@neondatabase/serverless`.
  - [x] Crear estructura base de carpetas: `src/core/`, `src/lib/` y `src/app/`.
  - [x] Configurar variables de entorno `.env.example` y cliente centralizado de conexión `src/core/shared/server/db.ts`.

- [x] **Tarjeta 3: Módulo Centralizado de Errores y Respuestas**
  - [x] Crear `src/lib/common/responses/apiResponse.ts` con helper genérico `ApiResponse<T>`.
  - [x] Crear `src/lib/common/responses/errorCodes.ts` con catálogo tipado de errores.
  - [x] Crear `src/lib/common/responses/appError.ts` con clase base de excepciones y status HTTP.
  - [x] Configurar middleware/manejador global de errores en ElysiaJS para atrapar y formatear fallos.

---

### 🔹 FASE 2: Autenticación y Shell Base
- [x] **Tarjeta 4: Autenticación con Better Auth**
  - [x] Definir schemas de Drizzle para Better Auth (`user`, `session`, `account`, `verification`).
  - [x] Configurar instancia de Better Auth con Drizzle Adapter en `src/core/auth/server/auth.ts`.
  - [x] Crear Route Handler en `src/app/api/auth/[...all]/route.ts`.
  - [x] Construir vista de Login / Registro simple (Nombre, Email, Password) con estética Dark Obsidian.
  - [x] Conectar cliente `createAuthClient` y proteger rutas del aplicativo.

- [x] **Tarjeta 5: Sistema de Diseño y Shell Móvil (UI/UX)**
  - [x] Importar y adaptar `app.css` oficial (tokens OKLCH, superficies glassmorphism, botones táctiles 3D).
  - [x] Implementar `AppShell` con viewport móvil centrado y soporte safe-area para celulares.
  - [x] Construir `BottomNav` fija con las 5 pestañas (*Entrenar*, *Simulacro*, *Errores*, *Balotario*, *Perfil*).
  - [x] Implementar `WebAudioSynthesizer` para efectos sonoros táctiles y hápticos offline.


---

### 🔹 FASE 3: Slices de Estudio (Core Features)
- [x] **Tarjeta 6: Feature `training-quiz` (Entrenamiento Inteligente)**
  - [x] `domain/`: Entidades `Question`, `Alternative`, `AnswerAttempt` y lógica de evaluación.
  - [x] `server/`: Rutas Elysia `/api/quiz` y consultas Drizzle para obtener preguntas del balotario.
  - [x] `client/`: Vista `02-quiz` (renderizado de enunciados, alternativas táctiles y contenedor de señal).
  - [x] `client/`: Vista `03-feedback` (bottom sheet animado, justificación técnica y suma de +10 XP).
  - [x] Store de entrenamiento con Zustand y TanStack Query para transiciones en 0ms.


- [x] **Tarjeta 7: Feature `streak-gamification` (Racha & Dashboard)**
  - [x] `domain/`: Lógica matemática de `Streak` (días consecutivos sin desfase de zona horaria) y `DailyGoal`.
  - [x] `server/`: Persistencia de telemetría de usuario en tabla `user_progress`.
  - [x] `client/`: Vista `01-dashboard` con chip de racha (`🔥 Streak`), barra de nivel XP y celdas de vidas.
  - [x] `client/`: Componente de anillo de progreso de meta diaria (`60% · 15/25 preguntas`).
  - [x] Tarjetas de modos de estudio con navegación integrada.

- [x] **Tarjeta 8: Feature `official-exam` (Simulacro 50 MTC)**
  - [x] `domain/`: Agregado `ExamSession`, `ScorePolicy` (aprobado con $\ge 40/50$) y cronómetro.
  - [x] `server/`: Endpoint Elysia para generar pool de 50 preguntas aleatorias y registrar resultados.
  - [x] `client/`: Vista `04-simulacro` con temporizador regresivo de 40:00 y botón de bandera (marcar dudas).
  - [x] `client/`: Grilla interactiva de 50 celdas (navegar libremente y visualizar estado de cada pregunta).
  - [x] `client/`: Vista `05-resultados` con dictamen oficial, tiempo transcurrido y botón para repasar falladas.

---

### 🔹 FASE 4: Repaso y Exploración
- [x] **Tarjeta 9: Feature `error-bank` (Banco de Errores)**
  - [x] `domain/`: Entidad `ErrorEntry` y política de repetición espaciada (eliminar tras 2 aciertos).
  - [x] `server/`: Tabla `error_bank` en Drizzle y acciones para registrar/despejar fallos por usuario.
  - [x] `client/`: Vista `06-errores` con cola de pendientes y filtro por categorías.
  - [x] Botón "Iniciar repaso" que lanza una sesión exclusiva con las preguntas falladas.

- [x] **Tarjeta 10: Feature `question-codex` (Explorador 200 Preguntas)**
  - [x] `server/`: Consultas optimizadas con búsqueda por palabra clave y código (`R-29`, `SOAT`, etc.).
  - [x] `client/`: Vista `06-balotario` con buscador reactivo instantáneo.
  - [x] Filtros en chips: *Todas · 200*, *Con imágenes*, *Favoritas ⭐*, *Dominadas ✅*.
  - [x] Acordeones colapsables para inspeccionar cualquier pregunta y respuesta en cualquier momento.

- [x] **Tarjeta 11: Feature `pilot-profile` (Perfil & Medallas)**
  - [x] `domain/`: Modelo de `PilotProfile` y catálogo de `Achievement` (medallas desbloqueables).
  - [x] `client/`: Vista `07-perfil` con avatar, nivel de piloto y estadísticas históricas.
  - [x] Barra de dominio total del balotario (`X / 200`) y visualización de logros conseguidos.
  - [x] Opción de cerrar sesión y configurar meta diaria.

---

### 🔹 FASE 5: Entrega y Experiencia Móvil
- [x] **Tarjeta 12: Configuración PWA y Modo Offline**
  - [x] Configurar `manifest.json` (nombre, colores temáticos, iconos y `display: standalone`).
  - [x] Service Worker y caché para almacenar las 200 preguntas y señales, garantizando uso sin internet.
  - [x] Optimizar animaciones y efectos sonoros por Web Audio API offline.

- [x] **Tarjeta 13: Pruebas Integrales y Verificación**
  - [x] Verificar flujo de creación de cuenta y login con Better Auth en Neon Postgres.
  - [x] Validar que las 200 preguntas y las 68 señales se muestren con fidelidad idéntica al PDF oficial.
  - [x] Comprobar navegación y ergonomía táctil en pantalla de celular.
  - [x] Verificar persistencia de racha y registro en el banco de errores.
