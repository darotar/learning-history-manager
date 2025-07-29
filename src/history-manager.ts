import { CursorList } from "./cursor-list";

export class HistoryManager extends CursorList<string> {
  navigateTo(url: string): void {
    this.insert(url);
    this.onNavigate(url);
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
    const url = super.go(steps);

    this.onNavigate(url);

    return url;
  }

  protected onNavigate(url: string | null): void {
    console.log("navigated to", url);
  }
}
