import React from 'react';
import { AuthView } from '@/core/auth/client/AuthView';
import Link from 'next/link';

export const metadata = {
  title: 'MTC-EXAM · Ingreso de Conductor',
  description: 'Inicia sesión o crea tu cuenta para guardar tu racha y simulacros.',
};

export default function LoginPage() {
  return (
    <div className="app-shell" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <header className="screen-head" style={{ padding: '16px 20px', borderBottom: '1px solid color-mix(in oklch, var(--accent-on) 6%, transparent)', margin: 0 }}>
        <Link href="/" className="screen-kicker" style={{ fontSize: 12 }}>
          ← Volver
        </Link>
        <span className="micro" style={{ color: 'var(--success)' }}>
          MTC A-1 OFICIAL
        </span>
      </header>

      <main className="app-main" style={{ display: 'grid', placeItems: 'center', padding: '20px 16px 40px' }}>
        <AuthView />
      </main>

      <footer style={{ padding: '16px', textAlign: 'center', borderTop: '1px solid color-mix(in oklch, var(--accent-on) 6%, transparent)' }}>
        <span className="micro" style={{ fontSize: 11 }}>
          MTC CLASE A - CATEGORÍA I · 200 PREGUNTAS
        </span>
      </footer>
    </div>
  );
}
