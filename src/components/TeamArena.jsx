import React from 'react';
import { ELEMENT_THEMES, ElementGlyph } from '../utils/ElementTheme';

export function TeamArena({
  engine,
  onRollTeam,
  onRollBoss,
  onRollBoth,
  onDefeat,
  onVictory,
  onUndo,
  onToggleLock,
  onChangeRarityFilter,
  onChangeBossFilter,
}) {
  const hasTeam = engine.currentTeam.some(Boolean);

  return (
    <section className="w-full border-b border-[#1E222D] bg-[#0D1017]">
      <div className="w-full px-6 lg:px-10 py-6 space-y-6">
        {/* Top Filter & Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1A1E28]">
          {/* Character Rarity Segmented Control */}
          <div className="flex items-center gap-3">
            <span className="font-mono-tech text-[11px] uppercase tracking-widest text-slate-500">
              Pool Rarity
            </span>
            <div className="inline-flex rounded-lg bg-[#080A0F] p-1 border border-[#1E222D]">
              {[
                { id: 'ALL', label: 'All (4★ & 5★)' },
                { id: '5', label: '5★ Only' },
                { id: '4', label: '4★ Only' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onChangeRarityFilter(opt.id)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    engine.rarityFilter === opt.id
                      ? 'bg-[#D4AF37] text-[#090B10] font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Boss Category Segmented Control */}
          <div className="flex items-center gap-3">
            <span className="font-mono-tech text-[11px] uppercase tracking-widest text-slate-500">
              Encounter Type
            </span>
            <div className="inline-flex rounded-lg bg-[#080A0F] p-1 border border-[#1E222D]">
              {[
                { id: 'ALL', label: 'All Bosses' },
                { id: 'map', label: 'Overworld' },
                { id: 'domain', label: 'Trounce Domain' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onChangeBossFilter(opt.id)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    engine.bossCategoryFilter === opt.id
                      ? 'bg-slate-200 text-[#090B10] font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4-Slot Tactical Party Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {engine.currentTeam.map((char, idx) => {
            const theme = char ? ELEMENT_THEMES[char.element] || ELEMENT_THEMES.Anemo : null;
            const isLocked = engine.lockedSlots[idx];

            return (
              <div
                key={idx}
                className={`relative overflow-hidden rounded-xl border transition-all duration-200 min-h-[156px] p-5 flex flex-col justify-between ${
                  char
                    ? `bg-[#121620] ${theme.border}`
                    : 'bg-[#0A0C12] border-dashed border-[#222736]'
                }`}
              >
                {/* Subtle Elemental Top Ambient Light */}
                {char && (
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${theme.glow}`}
                  />
                )}

                {/* Slot Header */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="font-mono-tech text-[11px] tracking-widest text-slate-500">
                    PARTY 0{idx + 1}
                  </span>

                  {char && (
                    <button
                      onClick={() => onToggleLock(idx)}
                      title={isLocked ? 'Unlock Slot' : 'Lock Slot'}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono-tech transition border ${
                        isLocked
                          ? 'bg-[#D4AF37]/15 border-[#D4AF37]/50 text-[#F5D77F]'
                          : 'bg-[#090B10]/70 border-[#252A3A] text-slate-400 hover:text-white'
                      }`}
                    >
                      {isLocked ? 'LOCKED' : 'LOCK'}
                    </button>
                  )}
                </div>

                {/* Character Details */}
                {char ? (
                  <div className="relative z-10 mt-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <ElementGlyph element={char.element} className="w-4 h-4 shrink-0" />
                      <span className={`font-mono-tech text-xs uppercase tracking-wider ${theme.text}`}>
                        {char.element}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span
                        className={`font-mono-tech text-xs font-semibold ${
                          char.rarity === 5 ? 'text-[#E5C158]' : 'text-purple-400'
                        }`}
                      >
                        {char.rarity}★
                      </span>
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-white truncate">
                      {char.name}
                    </h3>
                  </div>
                ) : (
                  <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center py-4">
                    <span className="font-mono-tech text-xs uppercase tracking-widest text-slate-600">
                      Unassigned Slot
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Encounter Target & Action Console */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch">
          {/* Target Boss Banner (7 cols) */}
          <div className="xl:col-span-7 rounded-xl bg-[#121620] border border-[#232838] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="font-mono-tech text-[11px] uppercase tracking-widest text-[#D4AF37]">
                  Target Encounter
                </span>
                {engine.currentBoss && (
                  <span
                    className={`font-mono-tech text-[10px] uppercase px-2 py-0.5 rounded border ${
                      engine.currentBoss.type === 'domain'
                        ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                        : 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                    }`}
                  >
                    {engine.currentBoss.type === 'domain' ? 'Trounce Domain' : 'Overworld Boss'}
                  </span>
                )}
              </div>
              <div className="font-display text-xl sm:text-2xl font-bold text-white tracking-wide">
                {engine.currentBoss ? engine.currentBoss.name : 'Awaiting Encounter Roll'}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={onRollTeam}
                className="px-3.5 py-2 rounded-lg bg-[#1A1F2E] hover:bg-[#232A3D] border border-[#2C3347] text-slate-200 text-xs font-semibold transition"
              >
                Roll Party
              </button>
              <button
                onClick={onRollBoss}
                className="px-3.5 py-2 rounded-lg bg-[#1A1F2E] hover:bg-[#232A3D] border border-[#2C3347] text-slate-200 text-xs font-semibold transition"
              >
                Roll Boss
              </button>
              <button
                onClick={onRollBoth}
                className="px-4 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#E2BE46] text-[#090B10] text-xs font-bold tracking-wide transition shadow-sm"
              >
                Deploy Full RNG
              </button>
            </div>
          </div>

          {/* Gauntlet Outcome Resolution (5 cols) */}
          <div className="xl:col-span-5 rounded-xl bg-[#121620] border border-[#232838] p-5 flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono-tech text-[11px] uppercase tracking-widest text-slate-400">
                Gauntlet Resolution
              </span>
              {engine.undoStack.length > 0 && (
                <button
                  onClick={onUndo}
                  className="font-mono-tech text-xs text-slate-400 hover:text-white underline underline-offset-4"
                >
                  Undo ({engine.undoStack.length})
                </button>
              )}
            </div>

            {hasTeam ? (
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={onDefeat}
                  className="px-3 py-2.5 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/40 text-rose-200 text-xs font-semibold transition text-center"
                >
                  Defeat — Eliminate & Reroll
                </button>
                <button
                  onClick={onVictory}
                  className="px-3 py-2.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-500/40 text-emerald-200 text-xs font-semibold transition text-center"
                >
                  Victory — Lock & Revive Fallen
                </button>
              </div>
            ) : (
              <div className="text-xs text-slate-500 py-2">
                Deploy a party to record encounter victory or defeat.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}