export class Boss {
  constructor({ id, name, type, active = true }) {
    this.id = id;
    this.name = name;
    this.type = type; // 'map' | 'domain'
    this.active = Boolean(active);
  }

  isEligible(categoryFilter = 'ALL') {
    if (!this.active) return false;
    if (categoryFilter !== 'ALL' && this.type !== categoryFilter) {
      return false;
    }
    return true;
  }

  toggleActive() {
    this.active = !this.active;
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
    };
  }
}