import { Character } from '../models/Character';
import { Boss } from '../models/Boss';

export class StorageService {
  constructor(storageKey = 'genshin_oop_gauntlet_v1') {
    this.storageKey = storageKey;
  }

  save(characters, bosses) {
    const payload = {
      characters: characters.map((c) => c.toJSON()),
      bosses: bosses.map((b) => b.toJSON()),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(this.storageKey, JSON.stringify(payload));
  }

  load(defaultCharacters, defaultBosses) {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) {
        return {
          characters: defaultCharacters.map((c) => new Character(c)),
          bosses: defaultBosses.map((b) => new Boss(b)),
        };
      }
      return this.parseRawJSON(raw);
    } catch (error) {
      console.error('Gagal memuat localStorage, menggunakan data default:', error);
      return {
        characters: defaultCharacters.map((c) => new Character(c)),
        bosses: defaultBosses.map((b) => new Boss(b)),
      };
    }
  }

  exportJSON(characters, bosses) {
    return JSON.stringify(
      {
        characters: characters.map((c) => c.toJSON()),
        bosses: bosses.map((b) => b.toJSON()),
      },
      null,
      2
    );
  }

  parseRawJSON(jsonString) {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed.characters) || !Array.isArray(parsed.bosses)) {
      throw new Error('Format JSON tidak valid: properti "characters" dan "bosses" wajib berupa array.');
    }

    return {
      characters: parsed.characters.map(
        (c, idx) =>
          new Character({
            id: c.id ?? `char_${Date.now()}_${idx}`,
            name: c.name,
            element: c.element || 'Anemo',
            rarity: c.rarity || 4,
            owned: c.owned !== undefined ? c.owned : true,
            status: c.status || 'ready',
          })
      ),
      bosses: parsed.bosses.map(
        (b, idx) =>
          new Boss({
            id: b.id ?? `boss_${Date.now()}_${idx}`,
            name: b.name,
            type: b.type === 'domain' ? 'domain' : 'map',
            active: b.active !== undefined ? b.active : true,
            defeated: Boolean(b.defeated),
          })
      ),
    };
  }
}