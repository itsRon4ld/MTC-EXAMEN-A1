'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { useCodexStore, CodexFilterType } from './useCodexStore';
import { soundFx } from '@/core/shared/client/AudioSynthesizer';
import { Question } from '@/core/training-quiz/domain/Question';

export const BalotarioView: React.FC = () => {
  const { searchTerm, activeFilter, favorites, setSearchTerm, setActiveFilter, toggleFavorite, isFavorite } =
    useCodexStore();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/balotario-200.json')
      .then((res) => res.json())
      .then((data: Question[]) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching questions for codex:', err);
        setLoading(false);
      });
  }, []);

  const totalWithImages = useMemo(() => questions.filter((q) => !!q.mediaUrl).length, [questions]);
  const totalFavorites = useMemo(() => Object.keys(favorites).length, [favorites]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // Filter by type
      if (activeFilter === 'images' && !q.mediaUrl) return false;
      if (activeFilter === 'favorites' && !favorites[q.id]) return false;

      // Filter by search query
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesPrompt = q.prompt.toLowerCase().includes(query);
        const matchesCode = q.code ? q.code.toLowerCase().includes(query) : false;
        const matchesCategory = q.category.toLowerCase().includes(query);
        const matchesOptions = q.options.some((opt) => opt.text.toLowerCase().includes(query));
        const matchesId = `pregunta ${q.id}`.includes(query) || `${q.id}` === query;

        return matchesPrompt || matchesCode || matchesCategory || matchesOptions || matchesId;
      }

      return true;
    });
  }, [questions, activeFilter, favorites, searchTerm]);

  return (
    <main className="app-main" style={{ paddingBottom: 120 }}>
      {/* Header */}
      <header className="screen-head" data-od-id="question-bank-header">
        <div>
          <div className="screen-kicker">200 preguntas oficiales</div>
          <h1 className="screen-title">Balotario MTC</h1>
        </div>
        <div className="telemetry-chip" style={{ color: 'var(--success)' }}>
          <span className="num">{filteredQuestions.length}</span>
          <span style={{ fontSize: 10, textTransform: 'uppercase' }}>Items</span>
        </div>
      </header>

      {/* Search & Filters */}
      <section data-od-id="question-bank-search" style={{ marginBottom: 16 }}>
        <label className="search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
          <input
            type="search"
            placeholder="Buscar por código (R-29), SOAT, velocidad, prioridad…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Buscar en el balotario"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              style={{ background: 'transparent', border: 0, color: 'var(--muted)', cursor: 'pointer', padding: 4 }}
            >
              ✕
            </button>
          )}
        </label>

        {/* Filter Chips */}
        <div className="filter-row" aria-label="Filtros del balotario">
          <button
            type="button"
            className={`filter ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => {
              soundFx.playClick();
              setActiveFilter('all');
            }}
          >
            Todas · {questions.length || 200}
          </button>
          <button
            type="button"
            className={`filter ${activeFilter === 'images' ? 'active' : ''}`}
            onClick={() => {
              soundFx.playClick();
              setActiveFilter('images');
            }}
          >
            Con imágenes ({totalWithImages})
          </button>
          <button
            type="button"
            className={`filter ${activeFilter === 'favorites' ? 'active' : ''}`}
            onClick={() => {
              soundFx.playClick();
              setActiveFilter('favorites');
            }}
          >
            Favoritas ⭐ ({totalFavorites})
          </button>
        </div>
      </section>

      {/* Loading state */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
          <p>Cargando balotario oficial...</p>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="panel glass" style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--muted)' }}>
          <p style={{ fontSize: 15, margin: '0 0 8px', color: 'var(--accent-on)' }}>No se encontraron preguntas</p>
          <p style={{ fontSize: 13, margin: 0 }}>Intenta con otro término de búsqueda o limpia los filtros activos.</p>
        </div>
      ) : (
        /* Questions List (Collapsible Accordions) */
        <section className="question-list" data-od-id="question-bank-list">
          {filteredQuestions.map((q) => {
            const fav = isFavorite(q.id);
            return (
              <details key={q.id} className="question-item">
                <summary>
                  <span className="q-code">{q.code || `P-${q.id}`}</span>
                  <span className="q-summary">
                    <strong>{q.category}</strong>
                    <span style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {q.prompt}
                    </span>
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        soundFx.playClick();
                        toggleFavorite(q.id);
                      }}
                      style={{
                        background: 'transparent',
                        border: 0,
                        fontSize: 16,
                        cursor: 'pointer',
                        color: fav ? 'var(--warn)' : 'var(--muted)',
                        padding: 4,
                      }}
                      aria-label="Marcar como favorita"
                    >
                      {fav ? '★' : '☆'}
                    </button>
                    <span style={{ color: 'var(--muted)', fontSize: 12 }}>⌄</span>
                  </div>
                </summary>

                <div className="question-detail">
                  {/* Full Prompt */}
                  <h3 style={{ fontSize: 15, fontWeight: 500, margin: '0 0 12px', color: 'var(--accent-on)', lineHeight: 1.35 }}>
                    {q.prompt}
                  </h3>

                  {/* Image Diagram if present */}
                  {q.mediaUrl && (
                    <div style={{ textAlign: 'center', margin: '12px 0', background: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 8 }}>
                      <Image
                        src={q.mediaUrl}
                        alt={`Señal ${q.code || q.id}`}
                        width={240}
                        height={120}
                        unoptimized
                        style={{
                          maxHeight: 140,
                          width: 'auto',
                          objectFit: 'contain',
                          margin: '0 auto',
                        }}
                      />
                    </div>
                  )}

                  {/* 4 Options */}
                  <div className="stack" style={{ gap: 8, margin: '12px 0' }}>
                    {q.options.map((opt) => {
                      const isCorrect = opt.key.toLowerCase() === q.correctAnswer.toLowerCase();
                      return (
                        <div
                          key={opt.key}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '28px 1fr',
                            alignItems: 'center',
                            gap: 10,
                            padding: '8px 10px',
                            borderRadius: 8,
                            background: isCorrect
                              ? 'color-mix(in oklch, var(--success) 14%, transparent)'
                              : 'color-mix(in oklch, var(--accent-on) 4%, transparent)',
                            border: `1px solid ${
                              isCorrect
                                ? 'color-mix(in oklch, var(--success) 50%, transparent)'
                                : 'color-mix(in oklch, var(--accent-on) 8%, transparent)'
                            }`,
                            color: isCorrect ? 'var(--success)' : 'var(--accent-on)',
                            fontSize: 13,
                          }}
                        >
                          <span
                            style={{
                              display: 'grid',
                              placeItems: 'center',
                              width: 28,
                              height: 28,
                              borderRadius: 6,
                              background: isCorrect ? 'var(--success)' : 'color-mix(in oklch, var(--accent-on) 10%, transparent)',
                              color: isCorrect ? 'var(--fg)' : 'inherit',
                              fontWeight: 700,
                              fontFamily: 'var(--font-mono)',
                              fontSize: 11,
                            }}
                          >
                            {opt.key.toUpperCase()}
                          </span>
                          <span>{opt.text}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Technical Explanation */}
                  {q.explanation && (
                    <div
                      style={{
                        marginTop: 10,
                        padding: '8px 12px',
                        borderRadius: 8,
                        background: 'color-mix(in oklch, var(--success) 8%, transparent)',
                        borderLeft: '3px solid var(--success)',
                        fontSize: 12,
                        color: 'color-mix(in oklch, var(--accent-on) 80%, var(--muted))',
                      }}
                    >
                      <strong style={{ color: 'var(--success)', display: 'block', marginBottom: 2 }}>
                        Respuesta Oficial MTC:
                      </strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              </details>
            );
          })}
        </section>
      )}
    </main>
  );
};
