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

- `amb.js` — McCarthy's ambiguous operator. Throw-and-replay
  implementation; exports `ambRun(func)`.
- `amb.test.js` — Bun-native test suite for `amb.js`.
- `solver.js` — thin amb-driver. Each puzzle is `{ name, run }`;
  `solve(puzzle)` enumerates all solutions via `ambRun`, and
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
only the puzzle data is exposed.

## How the solver works

Each puzzle exports `{ name, run }`:
- `name` — display string.
- `run(amb, fail)` — the puzzle as a function. It uses `amb(...vals)`
  to non-deterministically pick a value and `fail()` to reject the
  current path; backtracking finds another. On success it returns the
  answer vector `q` (1-indexed; `q[0]` unused).

`solver.js` is a thin wrapper: it passes `(amb, fail)` to the puzzle's
`run` via `ambRun`, pushes each successful return into a `sols` array,
calls `fail()` to drive the search to the next solution, and returns
all solutions when the choice tree is exhausted.

### How a puzzle is encoded

Each `run` body is straight-line Prolog-style: bind questions with
`amb`, assert each constraint at the earliest binding point its
referenced answers are all available, `fail()` if violated. Reading
top-to-bottom is roughly the puzzle in English. For example, SRAT
Q1 — "the first question whose answer is B is question N" — becomes:

    if (q[q[1]] !== B) fail();
    for (let i = 1; i < q[1]; i++) if (q[i] === B) fail();

placed right after `q[1..5]` are bound (the first five `amb` calls),
since `q[1] ∈ {1..5}` so all referenced answers are in scope.

### Why interleave constraints

A pure brute-force amb encoding (bind all 20 q's, then check
everything) is 5²⁰ ≈ 10¹⁴ paths — infeasible for SRAT. Asserting each
constraint at its natural binding point gives the search early
termination, the same pruning a hand-rolled backtracker would have
encoded explicitly. The smaller 10-question puzzles tolerate this less
strictly but the same idiom keeps them in the millisecond-to-second
range.

## Running

    bun suite.js          # the puzzle suite
    bun srat.js           # one puzzle in isolation
    bun test              # the amb tests

`suite.js` repeats each puzzle until its total runtime hits ~10s,
anchored to SRAT, which takes about that long for a single solve;
the rep count appears in parentheses when greater than one. Because
wall time is pinned by design, the rep count is the speed signal:
to compare optimizations, watch reps rise rather than times fall.

Output reports the puzzle name, solution count, wall time (seconds,
one decimal), rep count when greater than one, and each solution as
a sequence of letters.

## Implementing `amb`

`amb` has several plausible implementations in JavaScript. The one in
`amb.js` is approach 3 below (throw + replay). The others are
documented here as design notes — `amb.js` is one file and roughly 25
lines, easy to swap in a different impl if anything pushes back.

1. **`call/cc` continuations** — the canonical Scheme/Ruby idiom.
   Each `amb` captures the current continuation; `fail` invokes the
   stored one to retry. JavaScript lacks `call/cc`, so this needs
   simulation via async or a CPS transform — non-trivial.

2. **CPS callback** (cf. `patrickdlogan/ambjs`):
   `amb(choices, success, fail)`. The user passes "the rest of the
   computation" as a callback. Every `amb` deepens callback nesting,
   so the puzzle bodies become a pyramid.

3. **Throw + replay** (Rosetta Code's "Procedural" JavaScript). The
   driver records each `amb` call's chosen index in a stack; `fail()`
   throws a sentinel, the driver catches it, increments the deepest
   index, and re-runs the user function from the top. `amb` is
   positional — the Nth call reads the Nth slot — so reruns are
   deterministic. Puzzle bodies read as straight-line code with `amb()`
   and `fail()` calls inline. The driver is ~25 lines. The replay
   cost per backtrack is linear in the current path depth. The
   constraint: the user function must be pure of externally-visible
   side effects (it's re-run on every backtrack).

4. **Generators** (`function*` + `yield`). Each `amb` becomes
   `yield amb(choices)`; the driver iterates the generator and
   manages backtracking. No replay is needed — actual continuations
   are captured in the generator's state, so the user function may
   have arbitrary side effects. Bodies need `yield` on every `amb`
   and `fail`, but otherwise look the same as approach 3.

5. **Trampoline** (cf. ambjs's alternate impl). A CPS variant using
   thunks to keep the stack bounded; same callback pyramid as
   approach 2 plus trampoline plumbing.

The aim is for puzzle bodies to read as a faithful, easy-to-follow
encoding of the English questions. Approaches 3 and 4 deliver the
cleanest bodies; the rest impose nesting that obscures the
constraints. Between 3 and 4 the bodies look the same modulo `yield`
decoration, so the tiebreaker is driver simplicity — 3 wins.

## Testing `amb`

`amb.test.js` is a Bun-native test suite (`bun test`) with two
halves:

- **Examples** (5 tests) illustrate what `amb` is for: an `x·y = 8`
  factorization, the Rosetta four-word chain, a Pythagorean triple
  in `{1..6}`, SICP §4.3.2's Baker/Cooper/Fletcher/Miller/Smith
  floor puzzle, and the first 7 Pythagorean triples enumerated via
  lazy integer streams.
- **Implementation** (12 tests) covers the operator's behavior: no
  amb calls, `amb()` as a synonym for `fail`, top-level `fail()`,
  single amb, backtracking through to a satisfying value,
  no-solution paths, exception passthrough, leftmost-first DFS
  order, conditional branches with different amb counts, amb in a
  loop, deep nesting, and the throw-and-replay's side-effect caveat.

### `collect` and the `?:` trick

The streams example uses two patterns worth pulling out.

`collect(n, func)` gathers up to `n` solutions. Classical `amb`
returns one; to enumerate further you must `fail()` after each
success to force the search to keep going:

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

`solver.js` uses essentially the same pattern, with `n = ∞`.

The `?:` trick handles laziness. Scheme's `(amb a b)` doesn't
evaluate `b` until backtracking demands it, so

    (define (integers-from n)
      (amb n (integers-from (add1 n))))

recurses safely. Our `amb` is a regular varargs JS function — both
arguments would evaluate eagerly. Express the binary choice through
a JS ternary instead, whose arms are naturally lazy:

    const integersFrom = (amb, n) =>
      amb("here", "next") === "here" ? n : integersFrom(amb, n + 1);

`amb` makes the binary choice; the ternary picks which arm to
evaluate. The recursive call only happens when backtracking selects
`"next"`, which is what restores the laziness Scheme gets from
`call/cc`.
