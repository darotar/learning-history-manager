export class CursorList<T> {
  protected list: T[] = [];
  private cursor: number = -1;

  constructor(private maxSize: number = Infinity) {}

  get length(): number {
    return this.list.length;
  }

  get current(): T | null {
    return this.list[this.cursor] ?? null;
  }

  insert(val: T): void {
    if (this.cursor < this.list.length - 1) {
      this.list.splice(this.cursor + 1);
    }

    this.list.push(val);

    if (this.length > this.maxSize) {
      this.list.shift();
    }

    this.cursor = this.list.length - 1;
  }

  go(offset: number): T | null {
    if (this.list.length === 0) {
      this.cursor = -1;

      return null;
    }

    const target = this.cursor + offset;

    this.cursor = Math.max(0, Math.min(target, this.list.length - 1));

    return this.current;
  }

  back(): T | null {
    return this.go(-1);
  }

  forward(): T | null {
    return this.go(1);
  }
}
