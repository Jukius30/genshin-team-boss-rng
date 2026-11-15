import React, { useRef, useState } from 'react';
import { INITIAL_CHARACTERS, INITIAL_BOSSES } from './data/genshinDatabase';
import { Character } from './models/Character';
import { Boss } from './models/Boss';
import { StorageService } from './services/StorageService';
import { GauntletEngine } from './services/GauntletEngine';
import { TeamArena } from './components/TeamArena';
import { RosterManager } from './components/RosterManager';
import { JsonModal } from './components/JsonModal';

export default function App() {
  const storageRef = useRef(new StorageService());
  const engineRef = useRef(null);

  if (!engineRef.current) {
    const { characters, bosses } = storageRef.current.load(
      INITIAL_CHARACTERS,
      INITIAL_BOSSES
    );
    engineRef.current = new GauntletEngine(characters, bosses);
  }

  const [, setVersion] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);

  const syncAndRender = () => {
    storageRef.current.save(engineRef.current.characters, engineRef.current.bosses);
    setVersion((v) => v + 1);
  };

  const executeSafely = (fn) => {
    try {
      setErrorMsg('');
      fn();
      syncAndRender();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const engine = engineRef.current;

  return (
    <div className="min-h-screen w-full bg-[#090B10] text-[#E6E8EE] flex flex-col">
      {/* Full-Width Sticky Top Bar */}
      <header className="sticky top-0 z-30 w-full bg-[#090B10]/90 backdrop-blur-md border-b border-[#1E222D] px-6 lg:px-10 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rotate-45 bg-[#D4AF37]" />
          <h1 className="font-display text-lg sm:text-xl font-bold tracking-wider text-white">
            TEYVAT GAUNTLET
          </h1>
          <span className="hidden sm:inline-block font-mono-tech text-[11px] px-2 py-0.5 rounded bg-[#141822] text-slate-400 border border-[#232836]">
            LOCAL RNG ENGINE
          </span>
        </div>

        <button
          onClick={() => setIsJsonModalOpen(true)}
          className="font-mono-tech text-xs px-3.5 py-1.5 rounded-lg bg-[#141822] hover:bg-[#1C2230] border border-[#2A3142] text-[#E5C158] transition"
        >
          JSON DATA // IMPORT & EXPORT
        </button>
      </header>

      {errorMsg && (
        <div className="mx-6 lg:mx-10 mt-4 bg-rose-950/50 border border-rose-500/40 text-rose-200 px-4 py-2.5 rounded-lg text-xs font-mono-tech">
          [ERROR] {errorMsg}
        </div>
      )}

      {/* Main Full-Screen Workspace */}
      <main className="w-full flex-1">
        <TeamArena
          engine={engine}
          onRollTeam={() => executeSafely(() => engine.rollTeam())}
          onRollBoss={() => executeSafely(() => engine.rollBoss())}
          onRollBoth={() => executeSafely(() => engine.rollBoth())}
          onDefeat={() => executeSafely(() => engine.handleDefeat())}
          onVictory={() => executeSafely(() => engine.handleVictory())}
          onUndo={() => executeSafely(() => engine.undo())}
          onToggleLock={(idx) =>
            executeSafely(() => {
              engine.lockedSlots[idx] = !engine.lockedSlots[idx];
            })
          }
          onChangeRarityFilter={(val) =>
            executeSafely(() => {
              engine.rarityFilter = val;
            })
          }
          onChangeBossFilter={(val) =>
            executeSafely(() => {
              engine.bossCategoryFilter = val;
            })
          }
        />

        <RosterManager
          characters={engine.characters}
          bosses={engine.bosses}
          onToggleOwned={(id) =>
            executeSafely(() => {
              const char = engine.characters.find((c) => c.id === id);
              if (char) char.toggleOwned();
            })
          }
          onReviveSingle={(id) =>
            executeSafely(() => {
              const char = engine.characters.find((c) => c.id === id);
              if (char) char.resetChallengeStatus();
            })
          }
          onResetSession={() =>
            executeSafely(() => engine.resetChallengeSession())
          }
          onToggleBossActive={(id) =>
            executeSafely(() => {
              const boss = engine.bosses.find((b) => b.id === id);
              if (boss) boss.toggleActive();
            })
          }
          onAddCharacter={(name, element, rarity) =>
            executeSafely(() => {
              engine.characters.unshift(
                new Character({
                  id: `char_${Date.now()}`,
                  name,
                  element,
                  rarity,
                })
              );
            })
          }
          onAddBoss={(name, type) =>
            executeSafely(() => {
              engine.bosses.unshift(
                new Boss({
                  id: `boss_${Date.now()}`,
                  name,
                  type,
                })
              );
            })
          }
        />
      </main>

      <JsonModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        initialJson={storageRef.current.exportJSON(
          engine.characters,
          engine.bosses
        )}
        onImportJson={(rawJson) => {
          const { characters, bosses } = storageRef.current.parseRawJSON(rawJson);
          engine.characters = characters;
          engine.bosses = bosses;
          engine.currentTeam = [null, null, null, null];
          engine.currentBoss = null;
          syncAndRender();
        }}
      />
    </div>
  );
}