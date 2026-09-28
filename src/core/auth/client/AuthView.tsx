'use client';

import React, { useState } from 'react';
import { signIn, signUp } from './authClient';
import { soundFx } from '@/core/shared/client/AudioSynthesizer';

interface AuthViewProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export const AuthView: React.FC<AuthViewProps> = ({ onSuccess, onCancel, isModal = false }) => {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'register') {
        if (!name.trim()) {
          setError('Ingresa tu nombre completo');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres');
          setLoading(false);
          return;
        }

        const res = await signUp.email({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        });

        if (res.error) {
          setError(res.error.message || 'Error al crear la cuenta. Intenta de nuevo.');
        } else {
          soundFx.playSuccess();
          if (onSuccess) {
            onSuccess();
          } else {
            window.location.href = '/';
          }
        }
      } else {
        const res = await signIn.email({
          email: email.trim().toLowerCase(),
          password,
        });

        if (res.error) {
          setError(res.error.message || 'Credenciales inválidas. Verifica tu correo y contraseña.');
        } else {
          soundFx.playSuccess();
          if (onSuccess) {
            onSuccess();
          } else {
            window.location.href = '/';
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const containerClasses = isModal
    ? 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md'
    : 'w-full max-w-[440px] mx-auto py-6';

  return (
    <div className={containerClasses}>
      <div className="panel glass relative" style={{ padding: '32px 24px', borderRadius: 'var(--radius-lg)' }}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="icon-btn absolute top-4 right-4"
            aria-label="Cerrar modal"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        )}

        {/* Brand Header */}
        <header style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 80,
              height: 80,
              margin: '0 auto 14px',
              borderRadius: '22px',
              overflow: 'hidden',
              boxShadow: '0 8px 24px color-mix(in oklch, var(--success) 35%, transparent)',
              border: '2px solid color-mix(in oklch, var(--success) 50%, transparent)',
            }}
          >
            <img
              src="/logo.png"
              alt="MTC-EXAM A-1 Logo"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div className="screen-kicker">MTC-EXAM A-1 · PERÚ</div>
          <h1 className="screen-title" style={{ fontSize: 26, marginTop: 4 }}>
            {mode === 'register' ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </h1>
          <p className="muted" style={{ fontSize: 13, marginTop: 4, margin: '4px 0 0' }}>
            {mode === 'register'
              ? 'Regístrate para guardar tu racha y simulacros'
              : 'Accede a tu progreso y banco de errores'}
          </p>
        </header>

        {/* Large Prominent Segmented Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 6,
            padding: 6,
            marginBottom: 24,
            borderRadius: 'var(--radius-pill)',
            background: 'color-mix(in oklch, var(--accent-on) 6%, transparent)',
            border: '1px solid color-mix(in oklch, var(--accent-on) 12%, transparent)',
          }}
        >
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setMode('register');
              setError(null);
            }}
            style={{
              minHeight: 48,
              border: 0,
              borderRadius: 'var(--radius-pill)',
              background: mode === 'register' ? 'var(--success)' : 'transparent',
              color: mode === 'register' ? 'var(--fg)' : 'var(--muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: mode === 'register' ? '0 4px 14px color-mix(in oklch, var(--success) 40%, transparent)' : 'none',
            }}
          >
            Registrarse
          </button>
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setMode('login');
              setError(null);
            }}
            style={{
              minHeight: 48,
              border: 0,
              borderRadius: 'var(--radius-pill)',
              background: mode === 'login' ? 'var(--success)' : 'transparent',
              color: mode === 'login' ? 'var(--fg)' : 'var(--muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: mode === 'login' ? '0 4px 14px color-mix(in oklch, var(--success) 40%, transparent)' : 'none',
            }}
          >
            Ingresar
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              padding: '12px 14px',
              marginBottom: 18,
              borderRadius: 'var(--radius-md)',
              background: 'color-mix(in oklch, var(--danger) 16%, transparent)',
              border: '1px solid color-mix(in oklch, var(--danger) 45%, transparent)',
              color: 'var(--danger)',
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="stack" style={{ gap: 16 }}>
          {mode === 'register' && (
            <div>
              <label className="screen-kicker" style={{ display: 'block', marginBottom: 6, fontSize: 11 }}>
                Nombre del Conductor
              </label>
              <div className="search" style={{ minHeight: 52 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
                </svg>
                <input
                  type="text"
                  placeholder="Ej: Ronald Moreno"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={mode === 'register'}
                  autoComplete="name"
                  style={{ fontSize: 15 }}
                />
              </div>
            </div>
          )}

          <div>
            <label className="screen-kicker" style={{ display: 'block', marginBottom: 6, fontSize: 11 }}>
              Correo Electrónico
            </label>
            <div className="search" style={{ minHeight: 52 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                type="email"
                placeholder="conductor@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                style={{ fontSize: 15 }}
              />
            </div>
          </div>

          <div>
            <label className="screen-kicker" style={{ display: 'block', marginBottom: 6, fontSize: 11 }}>
              Contraseña
            </label>
            <div className="search" style={{ minHeight: 52 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                style={{ fontSize: 15 }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="action"
            style={{ marginTop: 8, minHeight: 56, fontSize: 15 }}
          >
            {loading ? (
              'Procesando...'
            ) : mode === 'register' ? (
              'Crear Cuenta de Conductor ➔'
            ) : (
              'Ingresar a la Cabina ➔'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
