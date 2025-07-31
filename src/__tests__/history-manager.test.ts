import { HistoryManager } from "../history-manager";

describe("HistoryManager", () => {
  let hm: HistoryManager;
  let listener: jest.Mock;

  beforeEach(() => {
    hm = new HistoryManager();
    listener = jest.fn();
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
    hm.back();
    hm.navigateTo("three");

    expect(hm.length).toBe(2);
    expect(hm.current).toBe("three");
    expect(hm.go(-1)).toBe("one");
  });

  describe("capacity limit", () => {
    it("drops oldest entries when maxSize is exceeded", () => {
      const hm = new HistoryManager(2);

      hm.navigateTo("one");
      hm.navigateTo("two");
      hm.navigateTo("three");

      expect(hm.length).toBe(2);
      expect(hm.current).toBe("three");

      expect(hm.back()).toBe("two");
    });
  });

  describe("event emitter", () => {
    test("emits on navigateTo", () => {
      hm.on("navigate", listener);
      hm.navigateTo("one");

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith("one");
    });

    test("emits on back and forward", () => {
      hm.on("navigate", listener);
      hm.navigateTo("a");
      hm.navigateTo("b");
      listener.mockClear();

      hm.back();
      expect(listener).toHaveBeenCalledWith("a");

      listener.mockClear();
      hm.forward();
      expect(listener).toHaveBeenCalledWith("b");
    });

    test("emits on go with arbitrary offset", () => {
      hm.on("navigate", listener);
      hm.navigateTo("x");
      hm.navigateTo("y");
      listener.mockClear();

      hm.go(-2);
      expect(listener).toHaveBeenCalledWith("x");
    });

    test("off unsubscribes listener", () => {
      hm.on("navigate", listener);
      hm.navigateTo("first");

      hm.off("navigate", listener);
      hm.navigateTo("second");

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith("first");
    });
  });

  describe("history guard", () => {
    test("blocks navigateTo when guard denies navigation", () => {
      hm.addGuard(() => false);
      hm.navigateTo("page1");

      expect(listener).not.toHaveBeenCalled();
      expect(hm.current).toBeNull();
    });

    test("allows navigateTo when guard approves navigation", () => {
      hm.addGuard(() => true);
      hm.navigateTo("page1");

      expect(hm.current).toBe("page1");
    });

    test("unsubscribe guard allows navigation again", () => {
      const unsubscribe = hm.addGuard(() => false);
      unsubscribe();
      hm.navigateTo("page1");

      expect(hm.current).toBe("page1");
    });

    test("blocks go when guard denies navigation", () => {
      hm.navigateTo("one");
      hm.navigateTo("two");
      hm.back();

      hm.addGuard(() => false);
      const result = hm.go(1);

      expect(result).toBeNull();
      expect(hm.current).toBe("one");
    });

    test("allows go when guard approves navigation", () => {
      hm.navigateTo("one");
      hm.navigateTo("two");
      hm.back();

      hm.addGuard(() => true);
      const result = hm.go(1);

      expect(result).toBe("two");
      expect(hm.current).toBe("two");
    });
  });
});
