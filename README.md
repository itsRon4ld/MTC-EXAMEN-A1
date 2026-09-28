# 🚗 MTC-EXAM A-1 (Balotario y Simulacro Oficial del MTC - Perú)

Aplicación móvil primero, interactiva y gamificada (estilo Duolingo Dark) diseñada para dominar las **200 preguntas oficiales** y las **68 señales y diagramas viales** del examen de reglas de tránsito del Ministerio de Transportes y Comunicaciones (MTC) del Perú (Clase A - Categoría I).

---

## ✨ Características Principales

- **🔥 Racha Diaria (Streak) & Telemetría:** Seguimiento de constancia diaria, nivel de conductor por XP y celdas de vidas.
- **🎯 Anillo de Meta Diaria:** Personalizable a 15, 25 o 50 preguntas diarias.
- **⚡ Entrenamiento Inteligente:** Práctica pregunta a pregunta con feedback instantáneo, justificación técnica y suma de XP.
- **⏱️ Simulacro Oficial MTC:** 50 preguntas aleatorias, cronómetro de 40:00 minutos, sistema de banderas (dudas), grilla de navegación de 50 celdas y dictamen oficial ($\ge 40/50$ para aprobar).
- **🧠 Banco de Errores (Repetición Espaciada):** Registro automático de preguntas falladas. Requiere 2 aciertos consecutivos para superarlas.
- **📖 Balotario & Codex Oficial (200 Preguntas):** Buscador reactivo instantáneo (código, palabras clave, temas), filtros por chips (*Todas*, *Con imágenes*, *Favoritas ⭐*) y acordeones colapsables.
- **🏆 Perfil de Piloto & Medallas:** Estadísticas históricas, medidor de dominio del balotario (`X / 200`) y logros desbloqueables.
- **🎵 Efectos Sonoros Offline:** Generación acústica en tiempo real mediante **Web Audio API** (cero dependencias de archivos de audio externos).
- **📱 PWA & Mobile First:** Experiencia de app nativa instalable en celulares con soporte offline.

---

## 🛠️ Stack Tecnológico & Arquitectura

- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript Estricto
- **Arquitectura:** Vertical Slice Architecture + Domain-Driven Design (DDD)
  - `src/core/<feature>/(domain · server · client)`
- **API Engine:** ElysiaJS + Eden Treaty (App Router Handler)
- **Base de Datos & ORM:** Drizzle ORM + Neon Serverless Postgres
- **Autenticación:** Better Auth (con Drizzle Adapter)
- **Estado Global:** Zustand con persistencia en localStorage
- **Data Fetching:** TanStack React Query
- **Diseño & UI:** OKLCH Design Tokens, Glassmorphism, Botones Táctiles 3D, Dark Obsidian

---

## 🚀 Instalación y Puesta en Marcha

### 1. Clonar el repositorio
```bash
git clone https://github.com/itsRon4ld/MTC-EXAMEN-A1.git
cd MTC-EXAMEN-A1
```

### 2. Instalar dependencias
```bash
npm install --legacy-peer-deps
```

### 3. Variables de Entorno (Opcional para DB remota)
Crea un archivo `.env.local` basado en `.env.example`:
```env
DATABASE_URL=postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require
BETTER_AUTH_SECRET=tu-secreto-de-32-caracteres
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
> *Nota:* La app incluye un fallback local para funcionar de inmediato sin requerir conexión a Neon.

### 4. Iniciar el servidor de desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador o dispositivo móvil.

---

## 📂 Estructura del Proyecto

```
src/
├── app/                           # Next.js App Router (Páginas y Route Handlers)
│   ├── api/                       # API Catch-all (Elysia) y Better Auth
│   ├── balotario/                 # Explorador 200 preguntas
│   ├── errores/                   # Banco de errores
│   ├── login/                     # Autenticación
│   ├── perfil/                    # Perfil y logros
│   ├── quiz/                      # Entrenamiento inteligente
│   ├── resultados/                # Resultados del simulacro
│   ├── simulacro/                 # Examen oficial 50 preguntas
│   └── simulacro-intro/           # Configuración del simulacro
├── core/                          # Vertical Slices (Dominio, Server y Client)
│   ├── auth/
│   ├── error-bank/
│   ├── official-exam/
│   ├── pilot-profile/
│   ├── question-codex/
│   ├── shared/
│   ├── streak-gamification/
│   └── training-quiz/
└── lib/
    └── common/responses/          # Respuestas y Errores Centralizados
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
