export class GauntletEngine {
  constructor(characters = [], bosses = []) {
    this.characters = characters;
    this.bosses = bosses;
    this.currentTeam = [null, null, null, null];
    this.lockedSlots = [false, false, false, false];
    this.currentBoss = null;
    this.rarityFilter = 'ALL'; // 'ALL' | '5' | '4'
    this.bossCategoryFilter = 'ALL'; // 'ALL' | 'map' | 'domain'
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
      throw new Error('Tidak ada boss aktif yang tersisa pada kategori ini.');
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
   * - Mencatat ke Battle Log & langsung gacha ulang 4 karakter baru
   */
  handleDefeat() {
    const activeMembers = this.currentTeam.filter(Boolean);
    if (activeMembers.length === 0) {
      throw new Error('Belum ada tim yang diacak.');
    }

    const activeIds = new Set(activeMembers.map((c) => c.id));
    this.characters.forEach((char) => {
      if (activeIds.has(char.id)) {
        char.markFallen();
      }
    });

    this.battleLog.unshift({
      id: `log_${Date.now()}`,
      type: 'DEFEAT',
      bossName: this.currentBoss?.name || 'No Target Boss',
      bossType: this.currentBoss?.type || null,
      team: activeMembers.map((c) => ({
        name: c.name,
        element: c.element,
        rarity: c.rarity,
      })),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    });

    this.lockedSlots = [false, false, false, false];
    this.rollTeam();
  }

  /**
   * Menang Lawan Boss:
   * - 4 karakter pemenang dikunci ('won')
   * - Semua karakter yang gugur sementara ('fallen') pulih kembali ('ready')
   * - Boss yang dikalahkan ditandai 'defeated'
   * - Mencatat ke Battle Log
   */
  handleVictory() {
    const activeMembers = this.currentTeam.filter(Boolean);
    if (activeMembers.length === 0) {
      throw new Error('Belum ada tim yang diacak.');
    }

    const winnerIds = new Set(activeMembers.map((c) => c.id));
    this.characters.forEach((char) => {
      if (winnerIds.has(char.id)) {
        char.markWon();
      } else if (char.status === 'fallen') {
        char.reviveFromFallen();
      }
    });

    if (this.currentBoss) {
      const targetBoss = this.bosses.find((b) => b.id === this.currentBoss.id);
      if (targetBoss) {
        targetBoss.markDefeated();
      }
    }

    this.battleLog.unshift({
      id: `log_${Date.now()}`,
      type: 'VICTORY',
      bossName: this.currentBoss?.name || 'No Target Boss',
      bossType: this.currentBoss?.type || null,
      team: activeMembers.map((c) => ({
        name: c.name,
        element: c.element,
        rarity: c.rarity,
      })),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    });

    this.currentTeam = [null, null, null, null];
    this.lockedSlots = [false, false, false, false];
    this.currentBoss = null;
  }

  /**
   * Reset Sesi Challenge (Permanen / Tanpa Undo):
   * Mengembalikan semua karakter ('fallen'/'won' -> 'ready'), boss ('defeated' -> false),
   * dan mengosongkan Battle Log tanpa menghapus daftar karakter 'Unowned'.
   */
  resetChallengeSession() {
    this.characters.forEach((c) => c.resetChallengeStatus());
    this.bosses.forEach((b) => b.resetChallengeStatus());
    this.currentTeam = [null, null, null, null];
    this.lockedSlots = [false, false, false, false];
    this.currentBoss = null;
    this.battleLog = [];
  }
}