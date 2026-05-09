import { test, expect, describe } from "bun:test";
import { ambRun, ambAll, FAIL } from "./amb";

// Examples — illustrate what amb is for and how it reads.

describe("amb examples", () => {
  test("factorization: x ∈ {1,2,3}, y ∈ {4,5,6}, x·y = 8", () => {
    const r = ambRun((amb, fail) =>
      amb([1, 2, 3], x =>
      amb([4, 5, 6], y =>
        x * y === 8 ? [x, y] : fail())));
    expect(r).toEqual([2, 4]);
  });

  test("four-word chain: last letter of each = first of next", () => {
    const linked = (a, b) => a.at(-1) === b.at(0);
    const r = ambRun((amb, fail) =>
      amb(["the", "that", "a"], w1 =>
      amb(["frog", "elephant", "thing"], w2 => {
        if (!linked(w1, w2)) return fail();
        return amb(["walked", "treaded", "grows"], w3 => {
          if (!linked(w2, w3)) return fail();
          return amb(["slowly", "quickly"], w4 => {
            if (!linked(w3, w4)) return fail();
            return [w1, w2, w3, w4].join(" ");
          });
        });
      })));
    expect(r).toBe("that thing grows slowly");
  });

  test("Pythagorean: a² = b² + c², all ∈ {1..6}", () => {
    const range = [1, 2, 3, 4, 5, 6];
    const r = ambRun((amb, fail) =>
      amb(range, a =>
      amb(range, b =>
      amb(range, c =>
        a * a === b * b + c * c ? [a, b, c] : fail()))));
    expect(r).toEqual([5, 3, 4]);
  });

  // SICP §4.3.2: five people on different floors of a 5-story building.
  // Baker not on top; Cooper not on bottom; Fletcher not top or bottom;
  // Miller higher than Cooper; Smith not adjacent to Fletcher;
  // Fletcher not adjacent to Cooper.
  test("Baker/Cooper/Fletcher/Miller/Smith floor puzzle", () => {
    const floors = [1, 2, 3, 4, 5];
    const distinct = (...xs) => new Set(xs).size === xs.length;
    const adj = (a, b) => Math.abs(a - b) === 1;
    const r = ambRun((amb, fail) =>
      amb(floors, baker => {
        if (baker === 5) return fail();
        return amb(floors, cooper => {
          if (cooper === 1) return fail();
          return amb(floors, fletcher => {
            if (fletcher === 1 || fletcher === 5) return fail();
            if (adj(fletcher, cooper)) return fail();
            return amb(floors, miller => {
              if (miller <= cooper) return fail();
              return amb(floors, smith => {
                if (!distinct(baker, cooper, fletcher, miller, smith))
                  return fail();
                if (adj(smith, fletcher)) return fail();
                return { baker, cooper, fletcher, miller, smith };
              });
            });
          });
        });
      }));
    expect(r).toEqual({
      baker: 3, cooper: 2, fletcher: 4, miller: 5, smith: 1,
    });
  });
});

// Implementation — coverage of the operator's behavior.

describe("amb implementation", () => {
  test("no amb calls — returns the value", () => {
    expect(ambRun(() => 42)).toBe(42);
  });

  test("returning FAIL at top level returns undefined", () => {
    expect(ambRun(() => FAIL)).toBeUndefined();
    expect(ambRun((_, fail) => fail())).toBeUndefined();
  });

  test("amb with empty choices returns FAIL", () => {
    expect(ambRun((amb) => amb([], () => 1))).toBeUndefined();
  });

  test("single amb returns the first non-FAIL value", () => {
    const r = ambRun((amb) => amb([1, 2, 3], x => x));
    expect(r).toBe(1);
  });

  test("single amb backtracks through FAIL to a satisfying value", () => {
    const r = ambRun((amb, fail) =>
      amb([1, 2, 3], x => x === 3 ? x : fail()));
    expect(r).toBe(3);
  });

  test("returns undefined when no choice satisfies", () => {
    const r = ambRun((amb, fail) =>
      amb([1, 2, 3], () => fail()));
    expect(r).toBeUndefined();
  });

  test("user exceptions propagate", () => {
    expect(() => ambRun(() => { throw new Error("oops"); }))
      .toThrow("oops");
  });

  test("solution found in leftmost-first DFS order", () => {
    // x·y = 8 admits (1,8), (2,4), (4,2), (8,1) within these ranges.
    // Outer x, inner y: (1,8) wins.
    const r = ambRun((amb, fail) =>
      amb([1, 2, 3, 4], x =>
      amb([1, 2, 3, 4, 5, 6, 7, 8], y =>
        x * y === 8 ? [x, y] : fail())));
    expect(r).toEqual([1, 8]);
  });

  test("ambAll collects every solution", () => {
    const sols = ambAll((amb, fail) =>
      amb([1, 2, 3], x =>
      amb([1, 2, 3], y =>
        x + y === 4 ? [x, y] : fail())));
    expect(sols).toEqual([[1, 3], [2, 2], [3, 1]]);
  });

  test("side effects fire once per outer choice (no replay)", () => {
    // Each outer-amb callback runs once per outer value; side
    // effects between two amb calls fire that many times — not
    // once per leaf, as throw-and-replay would.
    let xVisits = 0;
    ambRun((amb, fail) =>
      amb([1, 2, 3], x => {
        xVisits++;
        return amb([4, 5, 6], y =>
          x * y === 8 ? [x, y] : fail());
      }));
    expect(xVisits).toBe(2);  // x=1 (no y works), x=2 (success)
  });

  // Pythagorean search with the outer-choice side-effect captured
  // into a list so the test can assert it. Outer a iterates 1..7;
  // for each a, the inner search runs to completion (or success).
  // The first satisfying triple with a ≤ b is (3, 4, 5), so the
  // outer callback runs for a = 1, 2, 3 — once each — before the
  // search returns.
  test("outer-choice side-effect lands once per a", () => {
    const as = [];
    const range7 = [1, 2, 3, 4, 5, 6, 7];
    const r = ambRun((amb, fail) =>
      amb(range7, a => {
        as.push(a);
        return amb(range7, b =>
          amb(range7, c =>
            a > b ? fail()
            : a * a + b * b !== c * c ? fail()
            : [a, b, c]));
      }));
    expect(r).toEqual([3, 4, 5]);
    expect(as).toEqual([1, 2, 3]);
  });
});
