'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from '@/core/auth/client/authClient';
import { AuthView } from '@/core/auth/client/AuthView';
import { BottomNav } from './BottomNav';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();

  // 1. Loading session state
  if (isPending) {
    return (
      <div className="app-shell" style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 32,
              height: 32,
              border: '3px solid var(--success)',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              margin: '0 auto 14px',
              animation: 'spin 0.7s linear infinite',
            }}
          />
          <span className="screen-kicker">Cargando MTC-EXAM...</span>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated user -> Force Create Account / Login
  if (!session?.user) {
    return (
      <div className="app-shell" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <main className="app-main" style={{ paddingBottom: 40 }}>
          <AuthView onSuccess={() => (window.location.href = '/')} />
        </main>
      </div>
    );
  }

  // 3. Authenticated user -> Show App with BottomNav
  const isAuthPage = pathname === '/login';

  return (
    <div className="app-shell">
      {children}
      {!isAuthPage && <BottomNav />}
    </div>
  );
};
