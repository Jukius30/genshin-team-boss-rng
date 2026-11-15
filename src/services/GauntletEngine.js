export class GauntletEngine {
  constructor(characters = [], bosses = []) {
    this.characters = characters;
    this.bosses = bosses;
    this.currentTeam = [null, null, null, null];
    this.lockedSlots = [false, false, false, false];
    this.currentBoss = null;
    this.rarityFilter = 'ALL'; // 'ALL' | '5' | '4'
    this.bossCategoryFilter = 'ALL'; // 'ALL' | 'map' | 'domain'
    this.undoStack = [];
    this.battleLog = [];
  }

  /**
   * Algoritma Fisher-Yates Shuffle (peluang adil tanpa memandang rarity)
   */
  static shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  pushSnapshot(actionLabel) {
    this.undoStack.push({
      actionLabel,
      characters: this.characters.map((c) => c.clone()),
      bosses: this.bosses.map((b) => b.clone()),
      currentTeam: this.currentTeam.map((c) => (c ? c.clone() : null)),
      lockedSlots: [...this.lockedSlots],
      currentBoss: this.currentBoss ? this.currentBoss.clone() : null,
      battleLog: [...this.battleLog],
    });
    if (this.undoStack.length > 20) this.undoStack.shift();
  }

  undo() {
    if (this.undoStack.length === 0) return false;
    const prev = this.undoStack.pop();
    this.characters = prev.characters;
    this.bosses = prev.bosses;
    this.currentTeam = prev.currentTeam;
    this.lockedSlots = prev.lockedSlots;
    this.currentBoss = prev.currentBoss;
    this.battleLog = prev.battleLog;
    return true;
  }

  rollTeam() {
    const lockedIds = new Set(
      this.currentTeam
        .map((char, idx) => (this.lockedSlots[idx] && char ? char.id : null))
        .filter(Boolean)
    );

    const eligiblePool = this.characters.filter(
      (c) => c.isEligible(this.rarityFilter) && !lockedIds.has(c.id)
    );

    const neededCount = this.lockedSlots.filter((isLocked) => !isLocked).length;
    if (eligiblePool.length < neededCount) {
      throw new Error(
        `Karakter siap tidak cukup! Butuh ${neededCount} karakter, tersedia ${eligiblePool.length}.`
      );
    }

    const shuffled = GauntletEngine.shuffle(eligiblePool);
    let pickIndex = 0;

    this.currentTeam = this.currentTeam.map((existing, idx) => {
      if (this.lockedSlots[idx] && existing) return existing;
      return shuffled[pickIndex++];
    });
  }

  rollBoss() {
    const eligibleBosses = this.bosses.filter((b) =>
      b.isEligible(this.bossCategoryFilter)
    );
    if (eligibleBosses.length === 0) {
      throw new Error('Tidak ada boss aktif pada kategori yang dipilih.');
    }
    const shuffled = GauntletEngine.shuffle(eligibleBosses);
    this.currentBoss = shuffled[0];
  }

  rollBoth() {
    this.rollBoss();
    this.rollTeam();
  }

  /**
   * Kalah Lawan Boss:
   * - Boss tetap sama
   * - 4 karakter aktif digugurkan sementara ('fallen')
   * - Langsung gacha ulang 4 karakter dari sisa karakter 'ready'
   */
  handleDefeat() {
    const activeMembers = this.currentTeam.filter(Boolean);
    if (activeMembers.length === 0) {
      throw new Error('Belum ada tim yang diacak.');
    }

    this.pushSnapshot('Kalah Lawan Boss');

    const activeIds = new Set(activeMembers.map((c) => c.id));
    this.characters.forEach((char) => {
      if (activeIds.has(char.id)) {
        char.markFallen();
      }
    });

    this.lockedSlots = [false, false, false, false];
    this.battleLog.unshift({
      type: 'DEFEAT',
      bossName: this.currentBoss?.name || 'Unknown Boss',
      teamNames: activeMembers.map((c) => c.name),
      time: new Date().toLocaleTimeString(),
    });

    // Otomatis gacha ulang tim baru untuk melawan boss yang sama
    this.rollTeam();
  }

  /**
   * Menang Lawan Boss:
   * - 4 karakter terakhir yang menang dinonaktifkan permanen di sesi ini ('won')
   * - Semua karakter yang gugur sementara ('fallen') pulih kembali ('ready')
   */
  handleVictory() {
    const activeMembers = this.currentTeam.filter(Boolean);
    if (activeMembers.length === 0) {
      throw new Error('Belum ada tim yang diacak.');
    }

    this.pushSnapshot('Menang Lawan Boss');

    const winnerIds = new Set(activeMembers.map((c) => c.id));
    this.characters.forEach((char) => {
      if (winnerIds.has(char.id)) {
        char.markWon();
      } else if (char.status === 'fallen') {
        char.reviveFromFallen();
      }
    });

    this.battleLog.unshift({
      type: 'VICTORY',
      bossName: this.currentBoss?.name || 'Unknown Boss',
      teamNames: activeMembers.map((c) => c.name),
      time: new Date().toLocaleTimeString(),
    });

    this.currentTeam = [null, null, null, null];
    this.lockedSlots = [false, false, false, false];
    this.currentBoss = null;
  }

  /**
   * Reset Sesi Challenge:
   * Mengembalikan semua karakter 'fallen' dan 'won' menjadi 'ready',
   * tanpa mengubah status kepemilikan ('owned' / Tidak Punya).
   */
  resetChallengeSession() {
    this.pushSnapshot('Reset Sesi Challenge');
    this.characters.forEach((c) => c.resetChallengeStatus());
    this.currentTeam = [null, null, null, null];
    this.lockedSlots = [false, false, false, false];
    this.currentBoss = null;
    this.battleLog = [];
  }
}