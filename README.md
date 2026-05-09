# Self-referential aptitude tests

A self-referential aptitude test is a multiple-choice quiz in which each
question's answer depends on the other answers in the same quiz — and
often on its own. Jim Propp's S.R.A.T. (1993) is the canonical 20-question
example, with constraints like "the first question whose answer is B is
question N", "the number of questions with answer A is N", and "the
answer to this question is the same as the answer to question N".
Solvable by hand in roughly half an hour with care, and a fine workout
for a backtracking solver.

This repo is McCarthy's `amb` operator plus six real self-referential
puzzles encoded against it.

## Files

- `amb.js` — `amb` as a CPS callback (in the style of SICP §4.3).
  `amb(choices, k)` iterates choices, calling `k(c)`
  per choice; if `k` returns `FAIL`, tries the next choice. Exports
  `ambRun`, `ambAll`, `FAIL`.
- `amb.test.js` — Bun-native test suite for `amb.js`.
- `solver.js` — thin amb-driver. Each puzzle is `{ name, run }`;
  `solve(puzzle)` enumerates all solutions via `ambAll`, and
  `report(puzzle)` prints them with timing.
- `srat.js` — Jim Propp's S.R.A.T., 20Q × 5.
- `srt-1.js` — Patrick Honner's Simple Self-Referential Test, 5Q × 4.
- `srt-2.js` — Patrick Honner's Simple Self-Referential Test II,
  10Q × 5.
- `srq-1.js` — Bubalo & Cubrilo's Self-Referential Quiz 1, 10Q × 5.
- `srq-2.js` — Brainzilla's Self-Referential Quiz 2, 10Q × 5.
- `srat-henz.js` — Henz 1996's 10-question SRAT, used as a worked
  example in the Mozart/Oz documentation.
- `suite.js` — imports every puzzle and reports them in sequence.

Each puzzle file is runnable standalone (`bun srat.js`); when imported,
only the puzzle data is exposed. Each JS file has a Python sibling
mirroring the same structure (`amb.py` ↔ `amb.js`, etc.); hyphens
become underscores in Python so imports work (`srt_1.py`, `srat_henz.py`).

## How the solver works

Each puzzle exports `{ name, run }`:
- `name` — display string.
- `run(amb, fail)` — the puzzle as a function that *returns* the
  result of an `amb` chain. Each `amb(choices, k)` non-deterministically
  picks a value from `choices` and continues with `k(value)`. If `k`
  returns `FAIL`, amb tries the next choice; otherwise it returns
  whatever `k` returned. `fail()` returns the `FAIL` sentinel.

`solver.js` is a thin wrapper: `solve(puzzle)` calls `ambAll(run)`,
which runs `run` once with an `amb` that collects every successful
result rather than returning the first.

### How a puzzle is encoded

Each `run` body is a CPS pyramid: chained `amb([...], qN => ...)`
calls binding each question, with checks placed at the binding point
where their referenced answers are all in scope. Reading top-to-bottom
is roughly the puzzle in English. For example, SRAT Q1 — "the first
question whose answer is B is question N" — becomes:

    if (q[q1] !== B) return fail();
    if (q.slice(1, q1).includes(B)) return fail();

placed inside the callback for `q5` (the fifth `amb`), with `q` built
from the closed-over `q1..q5` values, since `q1 ∈ {1..5}` so all
referenced answers are in scope.

### Why the pyramid

The CPS structure is the call/cc emulation: each `amb`'s callback `k`
is invoked once per choice, so any side effects in `k`'s body fire
once per outer choice — not once per leaf, which is what a
throw-and-replay implementation would do. That's the property the
`t.js` smoke test pins down: `console.log("x =", x)` between two
`amb`s prints once for `x=1` and once for `x=2`, not three times for
each.

### Why interleave constraints

A pure brute-force amb encoding (bind all 20 q's, then check
everything) is 5²⁰ ≈ 10¹⁴ paths — infeasible for SRAT. Asserting each
constraint at its natural binding point gives the search early
termination, the same pruning a hand-rolled backtracker would have
encoded explicitly.

## Running

    bun suite.js          # the puzzle suite
    bun srat.js           # one puzzle in isolation
    bun test              # the amb tests
    bun t.js              # the side-effect smoke test

The same with Python: replace `bun X.js` with `python X.py`, e.g.
`python suite.py`, `python srat.py`, `python amb.test.py`.

`suite.js` runs each puzzle a fixed number of times — counts
calibrated so the total time per puzzle is roughly the same in
JavaScript. `suite.py` uses the same counts, so the two languages
can be compared directly. Wall time is the speed signal: lower is
faster.

Output reports the puzzle name, solution count, wall time (seconds,
one decimal), rep count, and each solution as a sequence of letters.

## Implementing `amb`

`amb` is the [ambiguous operator from McCarthy's "A Basis for a
Mathematical Theory of Computation" (1963)][mccarthy]; SICP §4.3
implements it on top of Scheme's `call/cc`. JavaScript has no
`call/cc`, so we need to emulate it. Several options, with very
different consequences for side-effect behavior:

[mccarthy]: https://www.softwarepreservation.org/projects/LISP/MIT/AIM-031.pdf

1. **CPS callback** (the current `amb.js`, cf. SICP §4.3).
   `amb(choices, k)` iterates choices, calling `k(c)` for each. The
   user's `run` is a chain of `amb([...], qN => ...)` calls, each one
   nesting inside the previous. The callback `k` is invoked once per
   outer choice, so side effects between two `amb`s fire once per
   outer-choice value — exactly call/cc semantics for this purpose.
   The cost is structural: the puzzle body is a pyramid. For SRAT's
   20 questions we factor it into a few `at_N` helper functions to
   keep individual lambdas short, but the shape is unavoidable.

2. **Throw + replay** (Rosetta Code's "Procedural" JavaScript). The
   driver records each `amb` call's chosen index in a stack; `fail()`
   throws a sentinel, the driver catches it, increments the deepest
   index, and re-runs the user function from the top. The user can
   write straight-line code with `const x = amb(...)` instead of a
   pyramid — but every backtrack re-runs the prefix, so a
   `console.log` between two `amb`s prints once per leaf in the search
   subtree, not once per outer choice. Same bug as `t.js`'s previous
   `x = 1` × 3.

3. **Generators** (`function*` + `yield amb(...)`). The user code is
   flat-with-yield, but the driver still has to recreate the
   generator and replay choices on backtrack — JS generators are
   single-shot, no clone, no rewind. Same side-effect behavior as
   approach 2.

4. **Iterator generators** (`for (const x of amb(...))`). `amb` is a
   generator that yields each choice; the user iterates with
   `for...of`. Single forward pass, no replay, side effects correct.
   But `amb` becomes a one-line `yield* values` and the user loses
   the `=` binding shape.

5. **`call/cc` itself**, simulated via a Babel-style CPS transform.
   Lets the user write `const x = amb(...)` and have call/cc
   semantics. Requires build tooling.

CPS (#1) is the only plain-JS way to keep `amb` substantive *and*
get correct side-effect behavior. The pyramid is the price; structure
helpers (`at_N` functions per check level) keep it readable.

## Testing `amb`

`amb.test.js` is a Bun-native test suite (`bun test`) with two
halves:

- **Examples** (4 tests) illustrate what `amb` is for: an `x·y = 8`
  factorization, the Rosetta four-word chain, a Pythagorean triple
  in `{1..6}`, and SICP §4.3.2's Baker/Cooper/Fletcher/Miller/Smith
  floor puzzle.
- **Implementation** (10 tests) covers the operator's behavior: no
  amb calls, top-level `fail()` / `FAIL`, empty-choice amb, single
  amb, backtracking through to a satisfying value, no-solution
  paths, exception passthrough, leftmost-first DFS order, `ambAll`
  enumeration, and the no-replay side-effect property — once per
  outer choice, not once per leaf.

`amb.test.py` mirrors the same tests in Python; either `pytest
amb.test.py` or `python amb.test.py` runs them (the file's
`__main__` block runs each `test_*` function and prints a
pass/fail summary, so pytest isn't required).

`t.js` (and the Python equivalent could be added) is a deliberately
tiny smoke test: a single `amb` chain with `console.log` between
two `amb`s, asserted by hand to print the outer choices once each.
It's the property that motivated the CPS choice; running it should
emit:

    x = 1
    x = 2
    [ 2, 4 ]
