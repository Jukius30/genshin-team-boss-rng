import React from 'react';

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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4 justify-between items-center border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Filter Karakter:
          </span>
          {['ALL', '5', '4'].map((val) => (
            <button
              key={val}
              onClick={() => onChangeRarityFilter(val)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                engine.rarityFilter === val
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {val === 'ALL' ? 'Semua (★4 & ★5)' : `Hanya ★${val}`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Kategori Boss:
          </span>
          {[
            { id: 'ALL', label: 'Semua Boss' },
            { id: 'map', label: 'Map (Overworld)' },
            { id: 'domain', label: 'Domain (Weekly)' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeBossFilter(item.id)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                engine.bossCategoryFilter === item.id
                  ? 'bg-indigo-500 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Character Slots */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {engine.currentTeam.map((char, idx) => (
          <div
            key={idx}
            className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between min-h-[140px]"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 font-mono">SLOT #{idx + 1}</span>
              {char && (
                <button
                  onClick={() => onToggleLock(idx)}
                  className={`text-xs px-2 py-0.5 rounded ${
                    engine.lockedSlots[idx]
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {engine.lockedSlots[idx] ? '🔒 Terkunci' : '🔓 Kunci'}
                </button>
              )}
            </div>

            {char ? (
              <div className="my-2">
                <div className="text-lg font-bold text-white">{char.name}</div>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <span>{char.element}</span>
                  <span>•</span>
                  <span className={char.rarity === 5 ? 'text-amber-400' : 'text-purple-400'}>
                    {'★'.repeat(char.rarity)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-600 italic my-auto text-center">
                Kosong — Tekan Acak Tim
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Boss Display */}
      <div className="bg-slate-950 border border-indigo-900/50 rounded-xl p-4 flex flex-wrap justify-between items-center gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">
            Target Boss Saat Ini
          </span>
          <div className="text-xl font-bold text-white mt-0.5">
            {engine.currentBoss ? engine.currentBoss.name : 'Belum ada boss dipilih'}
          </div>
          {engine.currentBoss && (
            <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
              {engine.currentBoss.type === 'domain' ? 'Trounce Domain (Weekly)' : 'Overworld / Map Boss'}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={onRollTeam}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition"
          >
            🎲 Acak Tim Saja
          </button>
          <button
            onClick={onRollBoss}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition"
          >
            👹 Acak Boss Saja
          </button>
          <button
            onClick={onRollBoth}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition"
          >
            ⚡ Acak Tim + Boss
          </button>
        </div>
      </div>

      {/* Gauntlet Battle Outcome Controls */}
      {hasTeam && (
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-slate-300">
            <strong className="text-white">Hasil Pertarungan Gauntlet:</strong> Tentukan hasil setelah melawan boss di atas.
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onDefeat}
              className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/50 text-rose-300 font-semibold text-sm transition"
            >
              💀 Kalah (Gugurkan Sementara & Gacha Ulang)
            </button>
            <button
              onClick={onVictory}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition"
            >
              🏆 Menang (Nonaktifkan Pemenang & Pulihkan yg Gugur)
            </button>
            {engine.undoStack.length > 0 && (
              <button
                onClick={onUndo}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition"
              >
                ↩ Undo ({engine.undoStack.length})
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}