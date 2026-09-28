'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { soundFx } from './AudioSynthesizer';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  // Hide bottom nav inside active quiz or active exam to avoid accidental tap distractions
  if (pathname === '/quiz' || pathname === '/simulacro' || pathname === '/login') {
    return null;
  }

  const items = [
    {
      href: '/',
      label: 'Entrenar',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="m13 2-8 12h6l-1 8 9-13h-6V2Z" />
        </svg>
      ),
    },
    {
      href: '/simulacro-intro',
      label: 'Simulacro',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="13" r="8" />
          <path d="M12 9v4l3 2M9 2h6" />
        </svg>
      ),
    },
    {
      href: '/errores',
      label: 'Errores',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="m7 7 10 10M17 7 7 17" />
        </svg>
      ),
    },
    {
      href: '/balotario',
      label: 'Balotario',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v17H7.5A3.5 3.5 0 0 0 4 22zM20 5.5A3.5 3.5 0 0 0 16.5 2H13v17h3.5A3.5 3.5 0 0 1 20 22z" />
        </svg>
      ),
    },
    {
      href: '/perfil',
      label: 'Perfil',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="8" r="4" />
          <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      {items.map((item) => {
        const isActive =
          item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href) || (item.href === '/simulacro-intro' && pathname === '/resultados');

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => soundFx.playClick()}
            className={`nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
