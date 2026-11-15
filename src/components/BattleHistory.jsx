import React, { useState } from 'react';
import { ElementGlyph } from '../utils/ElementTheme';

export function BattleHistory({ battleLog }) {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'VICTORY' | 'DEFEAT'

  const filteredLogs = battleLog.filter((item) =>
    filter === 'ALL' ? true : item.type === filter
  );

  const wins = battleLog.filter((item) => item.type === 'VICTORY').length;
  const losses = battleLog.filter((item) => item.type === 'DEFEAT').length;

  return (
    <section className="w-full px-6 lg:px-10 pt-6">
      <div className="bg-[#0D1017] border border-[#1E222D] rounded-xl p-5 space-y-4">
        {/* Header & Filter */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#1A1E28]">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-lg font-bold text-white tracking-wide">
              Battle History
            </h2>
            <div className="flex items-center gap-2 font-mono-tech text-xs">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                {wins} VICTORY
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                {losses} DEFEAT
              </span>
            </div>
          </div>

          <div className="inline-flex rounded-lg bg-[#080A0F] p-1 border border-[#1E222D]">
            {[
              { id: 'ALL', label: `All (${battleLog.length})` },
              { id: 'VICTORY', label: `Victory (${wins})` },
              { id: 'DEFEAT', label: `Defeat (${losses})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                  filter === tab.id
                    ? 'bg-slate-200 text-[#090B10] font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* List Riwayat */}
        {filteredLogs.length === 0 ? (
          <div className="py-8 text-center font-mono-tech text-xs text-slate-600">
            NO ENCOUNTER RECORDS YET — CLICK VICTORY OR DEFEAT AFTER A BATTLE TO LOG RESULTS.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 max-h-[320px] overflow-y-auto pr-1">
            {filteredLogs.map((log, index) => {
              const isWin = log.type === 'VICTORY';
              const roundNumber = battleLog.length - battleLog.indexOf(log);

              return (
                <div
                  key={log.id || index}
                  className={`rounded-lg border p-3.5 space-y-2.5 transition ${
                    isWin
                      ? 'bg-emerald-950/15 border-emerald-500/30'
                      : 'bg-rose-950/15 border-rose-500/30'
                  }`}
                >
                  {/* Top Row: Round, Status & Timestamp */}
                  <div className="flex items-center justify-between gap-2 font-mono-tech text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">#{String(roundNumber).padStart(2, '0')}</span>
                      <span
                        className={`px-2 py-0.5 rounded font-bold tracking-wider ${
                          isWin
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {log.type}
                      </span>
                    </div>
                    <span className="text-slate-500">{log.time}</span>
                  </div>

                  {/* Boss Name */}
                  <div className="text-xs font-semibold text-white truncate">
                    vs. {log.bossName}
                  </div>

                  {/* 4 Party Members */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-white/5">
                    {log.team.map((member, mIdx) => (
                      <div
                        key={mIdx}
                        className="flex items-center gap-1.5 bg-[#090B10]/70 border border-[#1E222D] rounded px-2 py-1 text-[11px]"
                      >
                        <ElementGlyph element={member.element} className="w-3 h-3 shrink-0" />
                        <span className="text-slate-200 truncate">{member.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}