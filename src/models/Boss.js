export class Boss {
  constructor({ id, name, type, active = true, defeated = false }) {
    this.id = id;
    this.name = name;
    this.type = type; // 'map' | 'domain'
    this.active = Boolean(active);
    this.defeated = Boolean(defeated);
  }

  isEligible(categoryFilter = 'ALL') {
    if (!this.active || this.defeated) return false;
    if (categoryFilter !== 'ALL' && this.type !== categoryFilter) {
      return false;
    }
    return true;
  }

  toggleActive() {
    this.active = !this.active;
  }

  markDefeated() {
    if (this.active) {
      this.defeated = true;
    }
  }

  resetChallengeStatus() {
    this.defeated = false;
  }

  clone() {
    return new Boss({ ...this });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      active: this.active,
      defeated: this.defeated,
    };
  }
}