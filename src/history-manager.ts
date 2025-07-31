import { EventEmitter } from "events";
import { CursorList } from "./cursor-list";
import { Guard, HistoryGuard } from "./history-guard";

export class HistoryManager extends CursorList<string> {
  private emitter = new EventEmitter();
  private guard = new HistoryGuard();

  addGuard: HistoryGuard["addGuard"] = (fn: Guard) => this.guard.addGuard(fn);

  constructor(maxSize: number = Infinity) {
    super(maxSize);
  }

  on(event: "navigate", fn: (url: string | null) => void) {
    this.emitter.on(event, fn);
  }

  off(event: "navigate", fn: (url: string | null) => void) {
    this.emitter.off(event, fn);
  }

  navigateTo(url: string): void {
    if (this.guard.canNavigate(this.current || "", url)) {
      this.insert(url);
      this.onNavigate(url);
    }
  }

  back(): string | null {
    const url = super.back();

    this.onNavigate(url);

    return url;
  }

  forward(): string | null {
    const url = super.forward();

    this.onNavigate(url);

    return url;
  }

  go(steps: number): string | null {
    const newCursor = this.cursor + steps;
    const to = this.list[Math.max(0, Math.min(newCursor, this.length - 1))];

    if (!this.guard.canNavigate(this.current || "", to)) return null;

    const url = super.go(steps);

    this.onNavigate(url);

    return url;
  }

  private onNavigate(url: string | null): void {
    this.emitter.emit("navigate", url);
    console.log("navigated to", url);
  }
}
