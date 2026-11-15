export class Character {
  constructor({ id, name, element, rarity, owned = true, status = 'ready' }) {
    this.id = id;
    this.name = name;
    this.element = element;
    this.rarity = Number(rarity);
    this.owned = Boolean(owned);
    // status: 'ready' | 'fallen' (gugur sementara) | 'won' (sudah menang)
    this.status = status;
  }

  isEligible(rarityFilter = 'ALL') {
    if (!this.owned || this.status !== 'ready') return false;
    if (rarityFilter !== 'ALL' && String(this.rarity) !== String(rarityFilter)) {
      return false;
    }
    return true;
  }

  toggleOwned() {
    this.owned = !this.owned;
    if (!this.owned) {
      this.status = 'ready';
    }
  }

  markFallen() {
    if (this.owned) this.status = 'fallen';
  }

  markWon() {
    if (this.owned) this.status = 'won';
  }

  reviveFromFallen() {
    if (this.status === 'fallen') {
      this.status = 'ready';
    }
  }

  resetChallengeStatus() {
    this.status = 'ready';
  }

  clone() {
    return new Character({ ...this });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      element: this.element,
      rarity: this.rarity,
      owned: this.owned,
      status: this.status,
    };
  }
}