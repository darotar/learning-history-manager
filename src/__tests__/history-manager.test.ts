import { HistoryManager } from "../history-manager";

describe("HistoryManager", () => {
  let hm: HistoryManager;

  beforeEach(() => {
    hm = new HistoryManager();
  });

  test("initial state", () => {
    expect(hm.length).toBe(0);
    expect(hm.current).toBeNull();
  });

  test("basic navigation", () => {
    hm.navigateTo("page1");
    expect(hm.length).toBe(1);
    expect(hm.current).toBe("page1");

    hm.navigateTo("page2");
    expect(hm.length).toBe(2);
    expect(hm.current).toBe("page2");
  });

  test("back and forward", () => {
    hm.navigateTo("a");
    hm.navigateTo("b");

    expect(hm.back()).toBe("a");
    expect(hm.current).toBe("a");

    expect(hm.forward()).toBe("b");
    expect(hm.current).toBe("b");
  });

  test("go clamps out-of-bounds", () => {
    hm.navigateTo("x");
    hm.navigateTo("y");

    expect(hm.go(-5)).toBe("x");
    expect(hm.go(5)).toBe("y");
  });

  test("navigating mid-history drops forward entries", () => {
    hm.navigateTo("one");
    hm.navigateTo("two");
    hm.back(); // at 'one'
    hm.navigateTo("three"); // drops 'two'

    expect(hm.length).toBe(2);
    expect(hm.current).toBe("three");
    expect(hm.go(-1)).toBe("one");
  });
});
