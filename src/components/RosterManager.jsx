import React, { useState } from 'react';

export function RosterManager({
  characters,
  bosses,
  onToggleOwned,
  onReviveSingle,
  onResetSession,
  onToggleBossActive,
  onAddCharacter,
  onAddBoss,
}) {
  const [search, setSearch] = useState('');
  const [newCharName, setNewCharName] = useState('');
  const [newCharElement, setNewCharElement] = useState('Pyro');
  const [newCharRarity, setNewCharRarity] = useState(5);

  const [newBossName, setNewBossName] = useState('');
  const [newBossType, setNewBossType] = useState('map');

  const filteredChars = characters.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    ready: characters.filter((c) => c.owned && c.status === 'ready').length,
    fallen: characters.filter((c) => c.owned && c.status === 'fallen').length,
    won: characters.filter((c) => c.owned && c.status === 'won').length,
    unowned: characters.filter((c) => !c.owned).length,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Kolom Karakter (2/3) */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <h2 className="text-lg font-bold text-white">Manajemen Karakter ({characters.length})</h2>
            <p className="text-xs text-slate-400">
              Klik kartu karakter untuk menandai <strong>Dimiliki</strong> / <strong>Tidak Punya</strong>.
            </p>
          </div>
          <button
            onClick={onResetSession}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold border border-slate-700"
          >
            🔄 Reset Sesi Challenge (Pertahankan Kepemilikan)
          </button>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Siap Gacha: {stats.ready}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/30">
            Gugur Sementara: {stats.fallen}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30">
            Sudah Menang: {stats.won}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-400">
            Tidak Punya: {stats.unowned}
          </span>
        </div>

        {/* Input Tambah Karakter & Pencarian */}
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Cari karakter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[160px] bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white"
          />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newCharName.trim()) return;
              onAddCharacter(newCharName.trim(), newCharElement, Number(newCharRarity));
              setNewCharName('');
            }}
            className="flex flex-wrap gap-2"
          >
            <input
              type="text"
              placeholder="Nama karakter baru..."
              value={newCharName}
              onChange={(e) => setNewCharName(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white"
            />
            <select
              value={newCharElement}
              onChange={(e) => setNewCharElement(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-sm text-white"
            >
              {['Pyro', 'Hydro', 'Anemo', 'Electro', 'Dendro', 'Cryo', 'Geo'].map((el) => (
                <option key={el} value={el}>{el}</option>
              ))}
            </select>
            <select
              value={newCharRarity}
              onChange={(e) => setNewCharRarity(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-sm text-white"
            >
              <option value={5}>★5</option>
              <option value={4}>★4</option>
            </select>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-sm"
            >
              + Tambah
            </button>
          </form>
        </div>

        {/* Grid Karakter */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[460px] overflow-y-auto pr-1">
          {filteredChars.map((char) => {
            let style = 'bg-slate-950 border-slate-800 text-white hover:border-slate-600';
            if (!char.owned) {
              style = 'bg-slate-950/40 border-slate-900 text-slate-600 line-through';
            } else if (char.status === 'fallen') {
              style = 'bg-rose-950/30 border-rose-800/60 text-rose-300';
            } else if (char.status === 'won') {
              style = 'bg-amber-950/30 border-amber-700/60 text-amber-300';
            }

            return (
              <div
                key={char.id}
                onClick={() => onToggleOwned(char.id)}
                className={`cursor-pointer border rounded-lg p-2.5 text-xs transition select-none flex flex-col justify-between ${style}`}
              >
                <div className="flex justify-between items-start gap-1">
                  <span className="font-semibold truncate">{char.name}</span>
                  <span className={char.rarity === 5 ? 'text-amber-400' : 'text-purple-400'}>
                    ★{char.rarity}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2 text-[11px]">
                  <span className="text-slate-400">{char.element}</span>
                  {!char.owned ? (
                    <span className="text-slate-500">Tidak Punya</span>
                  ) : char.status === 'fallen' ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onReviveSingle(char.id);
                      }}
                      className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/40"
                    >
                      💀 Gugur
                    </button>
                  ) : char.status === 'won' ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onReviveSingle(char.id);
                      }}
                      className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/40"
                    >
                      🏆 Menang
                    </button>
                  ) : (
                    <span className="text-emerald-400">Siap</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Kolom Boss (1/3) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white">Daftar Boss ({bosses.length})</h2>
          <p className="text-xs text-slate-400">Klik boss untuk mengaktifkan / menonaktifkan dari pool gacha.</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newBossName.trim()) return;
            onAddBoss(newBossName.trim(), newBossType);
            setNewBossName('');
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            placeholder="Nama boss baru..."
            value={newBossName}
            onChange={(e) => setNewBossName(e.target.value)}
            className="flex-1 min-w-0 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
          />
          <select
            value={newBossType}
            onChange={(e) => setNewBossType(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white"
          >
            <option value="map">Map</option>
            <option value="domain">Domain</option>
          </select>
          <button
            type="submit"
            className="px-2.5 py-1.5 rounded-lg bg-indigo-500 text-white font-bold text-xs"
          >
            +
          </button>
        </form>

        <div className="space-y-1.5 max-h-[490px] overflow-y-auto pr-1">
          {bosses.map((boss) => (
            <div
              key={boss.id}
              onClick={() => onToggleBossActive(boss.id)}
              className={`cursor-pointer border rounded-lg px-3 py-2 text-xs flex justify-between items-center transition ${
                boss.active
                  ? 'bg-slate-950 border-slate-800 text-white hover:border-indigo-500/50'
                  : 'bg-slate-950/40 border-slate-900 text-slate-600 line-through'
              }`}
            >
              <span className="truncate pr-2">{boss.name}</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold shrink-0 ${
                  boss.type === 'domain'
                    ? 'bg-purple-500/20 text-purple-300'
                    : 'bg-sky-500/20 text-sky-300'
                }`}
              >
                {boss.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}