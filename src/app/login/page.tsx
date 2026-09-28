import React from 'react';
import { AuthView } from '@/core/auth/client/AuthView';
import Link from 'next/link';

export const metadata = {
  title: 'MTC-EXAM · Ingreso de Conductor',
  description: 'Inicia sesión o crea tu cuenta para guardar tu racha y simulacros.',
};

export default function LoginPage() {
  return (
    <div className="app-shell min-h-screen flex flex-col justify-between">
      <div className="p-4 flex items-center justify-between border-b border-white/5">
        <Link href="/" className="screen-kicker text-sm font-bold text-slate-400 hover:text-white">
          ← Volver al inicio
        </Link>
        <span className="micro text-[10px] text-emerald-400 font-mono">BETTER-AUTH // SECURE</span>
      </div>

      <main className="app-main flex-1 flex items-center justify-center">
        <AuthView />
      </main>

      <footer className="p-4 text-center text-xs text-slate-600 border-t border-white/5 font-mono">
        MTC CLASE A - CATEGORÍA I · 200 PREGUNTAS OFICIALES
      </footer>
    </div>
  );
}
