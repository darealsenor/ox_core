export class PlayerCurrencies {
  private currencies: Record<string, number>

  constructor(initial: Record<string, number> = {}) {
    this.currencies = { ...initial }
  }

  get(code: string): number {
    return this.currencies[code] ?? 0
  }

  add(code: string, amount: number) {
    this.currencies[code] = this.get(code) + amount
  }

  subtract(code: string, amount: number): boolean {
    if (this.get(code) < amount) return false
    this.currencies[code] -= amount
    return true
  }

  set(code: string, amount: number) {
    this.currencies[code] = amount
  }

  toJSON(): Record<string, number> {
    return { ...this.currencies }
  }
}
