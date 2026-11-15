import React, { useState } from 'react';
import { ELEMENT_THEMES, ElementGlyph } from '../utils/ElementTheme';

export function RosterManager({
  characters,
  bosses,
  onToggleOwned,
  onReviveSingle,
  onResetSession,
  onToggleBossActive,
  onReviveSingleBoss,
  onAddCharacter,
  onAddBoss,
}) {
  const [search, setSearch] = useState('');
  const [elementFilter, setElementFilter] = useState('ALL');
  const [newCharName, setNewCharName] = useState('');
  const [newCharElement, setNewCharElement] = useState('Pyro');
  const [newCharRarity, setNewCharRarity] = useState(5);

  const [newBossName, setNewBossName] = useState('');
  const [newBossType, setNewBossType] = useState('map');

  const filteredChars = characters.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesElement = elementFilter === 'ALL' || c.element === elementFilter;
    return matchesSearch && matchesElement;
  });

  const stats = {
    ready: characters.filter((c) => c.owned && c.status === 'ready').length,
    fallen: characters.filter((c) => c.owned && c.status === 'fallen').length,
    won: characters.filter((c) => c.owned && c.status === 'won').length,
    unowned: characters.filter((c) => !c.owned).length,
  };

  return (
    <section className="w-full px-6 lg:px-10 py-6 grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* Left: Character Roster Matrix (8 cols) */}
      <div className="xl:col-span-8 bg-[#0D1017] border border-[#1E222D] rounded-xl p-5 space-y-4">
        {/* Header & Telemetry */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1A1E28]">
          <div>
            <h2 className="font-display text-lg font-bold text-white tracking-wide">
              Character Roster
            </h2>
            <p className="text-xs text-slate-400">
              Click any character card to toggle ownership status.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap items-center gap-2 font-mono-tech text-xs">
              <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                READY {stats.ready}
              </span>
              <span className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                FALLEN {stats.fallen}
              </span>
              <span className="px-2.5 py-1 rounded bg-[#D4AF37]/10 text-[#F5D77F] border border-[#D4AF37]/25">
                CLEARED {stats.won}
              </span>
              <span className="px-2.5 py-1 rounded bg-[#151923] text-slate-400 border border-[#232836]">
                UNOWNED {stats.unowned}
              </span>
            </div>

            <button
              onClick={onResetSession}
              className="px-3 py-1.5 rounded-lg bg-[#161B26] hover:bg-[#1E2534] border border-[#2A3142] text-xs font-medium text-slate-200 transition"
            >
              Reset Gauntlet
            </button>
          </div>
        </div>

        {/* Search, Element Filter & Quick Add */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[260px]">
            <input
              type="text"
              placeholder="Filter by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#090B10] border border-[#232836] focus:border-[#D4AF37] outline-none rounded-lg px-3 py-1.5 text-xs text-white w-48"
            />
            <div className="flex flex-wrap gap-1">
              {['ALL', 'Pyro', 'Hydro', 'Anemo', 'Electro', 'Dendro', 'Cryo', 'Geo'].map((el) => (
                <button
                  key={el}
                  onClick={() => setElementFilter(el)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono-tech transition ${
                    elementFilter === el
                      ? 'bg-slate-200 text-[#090B10] font-semibold'
                      : 'bg-[#121620] text-slate-400 hover:text-white border border-[#1E222D]'
                  }`}
                >
                  {el}
                </button>
              ))}
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newCharName.trim()) return;
              onAddCharacter(newCharName.trim(), newCharElement, Number(newCharRarity));
              setNewCharName('');
            }}
            className="flex items-center gap-1.5"
          >
            <input
              type="text"
              placeholder="Add custom character..."
              value={newCharName}
              onChange={(e) => setNewCharName(e.target.value)}
              className="bg-[#090B10] border border-[#232836] rounded-lg px-2.5 py-1.5 text-xs text-white w-40"
            />
            <select
              value={newCharElement}
              onChange={(e) => setNewCharElement(e.target.value)}
              className="bg-[#090B10] border border-[#232836] rounded-lg px-2 py-1.5 text-xs text-slate-300"
            >
              {['Pyro', 'Hydro', 'Anemo', 'Electro', 'Dendro', 'Cryo', 'Geo'].map((el) => (
                <option key={el} value={el}>{el}</option>
              ))}
            </select>
            <select
              value={newCharRarity}
              onChange={(e) => setNewCharRarity(e.target.value)}
              className="bg-[#090B10] border border-[#232836] rounded-lg px-2 py-1.5 text-xs text-slate-300"
            >
              <option value={5}>5★</option>
              <option value={4}>4★</option>
            </select>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-[#1E2433] hover:bg-[#283044] border border-[#323B52] text-xs font-semibold text-white"
            >
              Add
            </button>
          </form>
        </div>

        {/* Character Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-2.5 max-h-[540px] overflow-y-auto pr-1">
          {filteredChars.map((char) => {
            const theme = ELEMENT_THEMES[char.element] || ELEMENT_THEMES.Anemo;

            let cardStyle = 'bg-[#121620] border-[#222736] text-slate-100 hover:border-slate-500';
            if (!char.owned) {
              cardStyle = 'bg-[#090B10] border-[#161922] text-slate-600 opacity-55';
            } else if (char.status === 'fallen') {
              cardStyle = 'bg-rose-950/25 border-rose-500/40 text-rose-200';
            } else if (char.status === 'won') {
              cardStyle = 'bg-[#D4AF37]/10 border-[#D4AF37]/40 text-[#F5D77F]';
            }

            return (
              <div
                key={char.id}
                onClick={() => onToggleOwned(char.id)}
                className={`cursor-pointer border rounded-lg p-3 transition select-none flex flex-col justify-between gap-2 ${cardStyle}`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <ElementGlyph element={char.element} className="w-3.5 h-3.5 shrink-0" />
                    <span className={`text-xs font-semibold truncate ${!char.owned ? 'line-through' : ''}`}>
                      {char.name}
                    </span>
                  </div>
                  <span
                    className={`font-mono-tech text-[10px] shrink-0 ${
                      char.rarity === 5 ? 'text-[#E5C158]' : 'text-purple-400'
                    }`}
                  >
                    {char.rarity}★
                  </span>
                </div>

                <div className="flex items-center justify-between font-mono-tech text-[10px]">
                  <span className="text-slate-500 uppercase">{char.element}</span>
                  {!char.owned ? (
                    <span className="text-slate-600">UNOWNED</span>
                  ) : char.status === 'fallen' ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onReviveSingle(char.id);
                      }}
                      className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/35"
                    >
                      FALLEN • REVIVE
                    </button>
                  ) : char.status === 'won' ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onReviveSingle(char.id);
                      }}
                      className="px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#F5D77F] hover:bg-[#D4AF37]/35"
                    >
                      CLEARED • UNLOCK
                    </button>
                  ) : (
                    <span className={theme.text}>READY</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Boss Registry (4 cols) */}
      <div className="xl:col-span-4 bg-[#0D1017] border border-[#1E222D] rounded-xl p-5 space-y-4 flex flex-col">
        <div className="pb-4 border-b border-[#1A1E28]">
          <h2 className="font-display text-lg font-bold text-white tracking-wide">
            Encounter Registry ({bosses.filter((b) => b.active && !b.defeated).length}/
            {bosses.filter((b) => b.active).length})
          </h2>
          <p className="text-xs text-slate-400">
            Boss yang sudah dikalahkan terkunci otomatis hingga Gauntlet di-reset.
          </p>
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
            placeholder="Add custom boss..."
            value={newBossName}
            onChange={(e) => setNewBossName(e.target.value)}
            className="flex-1 min-w-0 bg-[#090B10] border border-[#232836] rounded-lg px-3 py-1.5 text-xs text-white"
          />
          <select
            value={newBossType}
            onChange={(e) => setNewBossType(e.target.value)}
            className="bg-[#090B10] border border-[#232836] rounded-lg px-2 py-1.5 text-xs text-slate-300"
          >
            <option value="map">Map</option>
            <option value="domain">Domain</option>
          </select>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-[#1E2433] hover:bg-[#283044] border border-[#323B52] text-xs font-semibold text-white"
          >
            Add
          </button>
        </form>

        <div className="space-y-1.5 max-h-[540px] overflow-y-auto pr-1 flex-1">
          {bosses.map((boss) => {
            let bossStyle =
              'bg-[#121620] border-[#222736] text-slate-200 hover:border-slate-500';
            if (!boss.active) {
              bossStyle =
                'bg-[#090B10] border-[#161922] text-slate-600 line-through opacity-55';
            } else if (boss.defeated) {
              bossStyle =
                'bg-[#D4AF37]/10 border-[#D4AF37]/40 text-[#F5D77F]';
            }

            return (
              <div
                key={boss.id}
                onClick={() => onToggleBossActive(boss.id)}
                className={`cursor-pointer border rounded-lg px-3 py-2.5 text-xs flex items-center justify-between gap-2 transition select-none ${bossStyle}`}
              >
                <span className="truncate font-medium">{boss.name}</span>

                <div className="flex items-center gap-1.5 shrink-0">
                  {boss.active && boss.defeated && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onReviveSingleBoss(boss.id);
                      }}
                      className="font-mono-tech text-[10px] px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#F5D77F] hover:bg-[#D4AF37]/35"
                    >
                      CLEARED • UNLOCK
                    </button>
                  )}

                  <span
                    className={`font-mono-tech text-[10px] uppercase px-2 py-0.5 rounded border ${
                      boss.type === 'domain'
                        ? 'bg-purple-500/10 text-purple-300 border-purple-500/25'
                        : 'bg-sky-500/10 text-sky-300 border-sky-500/25'
                    }`}
                  >
                    {boss.type}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}