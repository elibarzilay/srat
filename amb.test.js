import { test, expect, describe } from "bun:test";
import { ambRun } from "./amb";

// Examples — illustrate what amb is for and how it reads.

describe("amb examples", () => {
  test("factorization: x ∈ {1,2,3}, y ∈ {4,5,6}, x·y = 8", () => {
    const r = ambRun((amb, fail) => {
      const x = amb(1, 2, 3);
      const y = amb(4, 5, 6);
      if (x * y !== 8) fail();
      return [x, y];
    });
    expect(r).toEqual([2, 4]);
  });

  test("four-word chain: last letter of each = first of next", () => {
    const r = ambRun((amb, fail) => {
      const linked = (a, b) => a.at(-1) === b.at(0);
      const w1 = amb("the", "that", "a");
      const w2 = amb("frog", "elephant", "thing");
      if (!linked(w1, w2)) fail();
      const w3 = amb("walked", "treaded", "grows");
      if (!linked(w2, w3)) fail();
      const w4 = amb("slowly", "quickly");
      if (!linked(w3, w4)) fail();
      return [w1, w2, w3, w4].join(" ");
    });
    expect(r).toBe("that thing grows slowly");
  });

  test("Pythagorean: a² = b² + c², all ∈ {1..6}", () => {
    const r = ambRun((amb, fail) => {
      const int6 = () => amb(1, 2, 3, 4, 5, 6);
      const a = int6();
      const b = int6();
      const c = int6();
      if (a * a !== b * b + c * c) fail();
      return [a, b, c];
    });
    expect(r).toEqual([5, 3, 4]);
  });

  // SICP §4.3.2: five people on different floors of a 5-story building.
  // Baker not on top; Cooper not on bottom; Fletcher not top or bottom;
  // Miller higher than Cooper; Smith not adjacent to Fletcher;
  // Fletcher not adjacent to Cooper.
  test("Baker/Cooper/Fletcher/Miller/Smith floor puzzle", () => {
    const r = ambRun((amb, fail) => {
      const distinct = (...xs) => new Set(xs).size === xs.length;
      const adj = (a, b) => Math.abs(a - b) === 1;
      const baker = amb(1, 2, 3, 4, 5);
      if (baker === 5) fail();
      const cooper = amb(1, 2, 3, 4, 5);
      if (cooper === 1) fail();
      const fletcher = amb(1, 2, 3, 4, 5);
      if (fletcher === 1 || fletcher === 5) fail();
      const miller = amb(1, 2, 3, 4, 5);
      if (miller <= cooper) fail();
      const smith = amb(1, 2, 3, 4, 5);
      if (!distinct(baker, cooper, fletcher, miller, smith)) fail();
      if (adj(smith, fletcher)) fail();
      if (adj(fletcher, cooper)) fail();
      return { baker, cooper, fletcher, miller, smith };
    });
    expect(r).toEqual({
      baker: 3, cooper: 2, fletcher: 4, miller: 5, smith: 1,
    });
  });

  // The Scheme original uses lazy amb so `(amb n (recursive-call))`
  // doesn't evaluate the recursion until backtracking demands it.
  // Our amb is eager (varargs), so the lazy two-arm choice becomes
  // `amb("here","next") === "here" ? n : recurse(...)` — the JS
  // ternary gives the laziness Scheme gets from `call/cc`.
  test("first 7 Pythagorean triples via integers-from/between", () => {
    const collect = (n, func) => {
      const sols = [];
      ambRun((amb, fail) => {
        const v = func(amb, fail);
        sols.push(v);
        if (sols.length < n) fail();
        return v;
      });
      return sols;
    };
    const integersFrom = (amb, n) =>
      amb("here", "next") === "here" ? n : integersFrom(amb, n + 1);
    const integersBetween = (amb, fail, n, m) => {
      if (!(n <= m)) fail();
      return amb("here", "next") === "here"
        ? n
        : integersBetween(amb, fail, n + 1, m);
    };
    const triples = collect(7, (amb, fail) => {
      const a = integersFrom(amb, 1);
      const b = integersBetween(amb, fail, 1, a);
      const c = integersBetween(amb, fail, 1, a);
      if (a * a !== b * b + c * c) fail();
      return [a, b, c];
    });
    expect(triples.length).toBe(7);
    expect(triples[0]).toEqual([5, 3, 4]);
    for (const [a, b, c] of triples) {
      expect(a * a).toBe(b * b + c * c);
    }
  });
});

// Implementation — thorough coverage of the operator's behavior.

describe("amb implementation", () => {
  test("no amb calls — returns the function's value", () => {
    expect(ambRun(() => 42)).toBe(42);
  });

  test("amb() with no arguments fails", () => {
    expect(ambRun(amb => amb())).toBeUndefined();
  });

  test("fail() at top level returns undefined", () => {
    expect(ambRun((_, fail) => fail())).toBeUndefined();
  });

  test("single amb returns the first value when no constraint", () => {
    expect(ambRun(amb => amb(1, 2, 3))).toBe(1);
  });

  test("single amb backtracks through to a satisfying value", () => {
    const r = ambRun((amb, fail) => {
      const x = amb(1, 2, 3);
      if (x !== 3) fail();
      return x;
    });
    expect(r).toBe(3);
  });

  test("returns undefined when no choice satisfies", () => {
    const r = ambRun((amb, fail) => {
      const x = amb(1, 2, 3);
      if (x > 0) fail();
      return x;
    });
    expect(r).toBeUndefined();
  });

  test("user exceptions other than fail propagate", () => {
    expect(() => ambRun(() => { throw new Error("oops"); }))
      .toThrow("oops");
  });

  test("solution found in leftmost-first DFS order", () => {
    // x·y = 8 admits (1,8), (2,4), (4,2), (8,1) within these ranges.
    // Leftmost-first: iterate x outer, y inner; (1,8) wins.
    const r = ambRun((amb, fail) => {
      const x = amb(1, 2, 3, 4);
      const y = amb(1, 2, 3, 4, 5, 6, 7, 8);
      if (x * y !== 8) fail();
      return [x, y];
    });
    expect(r).toEqual([1, 8]);
  });

  test("conditional amb — branches with different amb counts work", () => {
    const r = ambRun((amb, fail) => {
      const tag = amb("short", "long");
      if (tag === "short") return tag;
      const n = amb(1, 2, 3);
      if (n !== 2) fail();
      return [tag, n];
    });
    expect(r).toBe("short");                // first branch wins
  });

  test("amb inside a loop", () => {
    const r = ambRun((amb, fail) => {
      const xs = [];
      for (let i = 0; i < 4; i++) {
        const v = amb(0, 1);
        if (v !== 1) fail();
        xs.push(v);
      }
      return xs;
    });
    expect(r).toEqual([1, 1, 1, 1]);
  });

  test("deep nesting — 5 ambs, only the last leaf satisfies", () => {
    // 32 leaves; the search must walk the whole tree before
    // reaching the all-ones path.
    const r = ambRun((amb, fail) => {
      const xs = Array.from({ length: 5 }, () => amb(0, 1));
      if (xs.some(x => x !== 1)) fail();
      return xs;
    });
    expect(r).toEqual([1, 1, 1, 1, 1]);
  });

  test("func is replayed from the top on each backtrack", () => {
    // Documents the side-effect caveat of the throw-and-replay impl.
    let calls = 0;
    ambRun((amb, fail) => {
      calls++;
      const x = amb(1, 2, 3);
      if (x !== 3) fail();
      return x;
    });
    expect(calls).toBe(3);
  });
});
