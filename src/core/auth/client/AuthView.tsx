'use client';

import React, { useState } from 'react';
import { signIn, signUp, useSession } from './authClient';

interface AuthViewProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export const AuthView: React.FC<AuthViewProps> = ({ onSuccess, onCancel, isModal = false }) => {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    : 'min-h-[80vh] flex flex-col justify-center px-4 py-8 max-w-[420px] mx-auto';

  return (
    <div className={containerClasses}>
      <div className="panel glass w-full max-w-[400px] mx-auto relative shadow-2xl">
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

        <header className="mb-6 text-center">
          <div className="screen-kicker">MTC-EXAM PILOT</div>
          <h1 className="screen-title text-2xl font-light mt-1">
            {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h1>
          <p className="muted text-xs mt-1">
            {mode === 'login'
              ? 'Guarda tus rachas y simulacros en Neon Postgres'
              : 'Empieza a practicar las 200 preguntas hoy mismo'}
          </p>
        </header>

        {/* Tab Selector */}
        <div className="flex rounded-xl p-1 bg-white/5 border border-white/10 mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'login' ? 'bg-[var(--success)] text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Ingresar
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'register' ? 'bg-[var(--success)] text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Registrarse
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="stack">
          {mode === 'register' && (
            <div>
              <label className="micro block mb-1.5 font-bold">Nombre del Conductor</label>
              <div className="search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
                </svg>
                <input
                  type="text"
                  placeholder="Tu nombre o apodo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={mode === 'register'}
                  autoComplete="name"
                />
              </div>
            </div>
          )}

          <div>
            <label className="micro block mb-1.5 font-bold">Correo Electrónico</label>
            <div className="search">
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
              />
            </div>
          </div>

          <div>
            <label className="micro block mb-1.5 font-bold">Contraseña</label>
            <div className="search">
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
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="action mt-2 w-full flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-spin inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
            ) : mode === 'login' ? (
              'Ingresar a la Cabina ➔'
            ) : (
              'Crear Cuenta de Conductor ➔'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
