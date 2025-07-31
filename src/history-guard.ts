export type Guard = (
  from: string | null,
  to: string
) => boolean | Promise<boolean>;

export class HistoryGuard {
  private guards: Guard[] = [];

  addGuard(fn: Guard): () => void {
    this.guards.push(fn);

    return () => {
      this.guards = this.guards.filter((g) => g !== fn);
    };
  }

  canNavigate(from: string, to: string): boolean {
    for (const g of this.guards) {
      if (g(from, to)) return true;

      return false;
    }

    return true;
  }
}
