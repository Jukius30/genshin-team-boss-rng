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

  // Trigger re-render setiap kali state di dalam instance OOP berubah
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
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Genshin Impact Team & Boss Gauntlet RNG
            </h1>
            <p className="text-sm text-slate-400">
              Arsitektur OOP ReactJS • Tanpa Database (LocalStorage & JSON)
            </p>
          </div>
          <button
            onClick={() => setIsJsonModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-semibold text-amber-400"
          >
            {`{ } Kelola / Export / Import JSON`}
          </button>
        </header>

        {errorMsg && (
          <div className="bg-rose-950/60 border border-rose-500/50 text-rose-200 px-4 py-3 rounded-xl text-sm">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Arena Gacha & Gauntlet */}
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

        {/* Manajemen Karakter & Boss */}
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

        {/* Modal JSON */}
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
    </div>
  );
}