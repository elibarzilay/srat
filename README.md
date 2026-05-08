# Self-referential aptitude tests

A self-referential aptitude test is a multiple-choice quiz in which each
question's answer depends on the other answers in the same quiz — and
often on its own. Jim Propp's S.R.A.T. (1993) is the canonical 20-question
example, with constraints like "the first question whose answer is B is
question N", "the number of questions with answer A is N", and "the
answer to this question is the same as the answer to question N".
Solvable by hand in roughly half an hour with care, and a fine workout
for a backtracking solver.

This repo is a small backtracking framework plus five real
self-referential puzzles encoded against it.

## Files

- `solver.js` — the framework. 1..K-domain backtracking with
  three-valued partial-state pruning. Exports `solve`, `run`, and the
  helpers `countWith` and `inRange`.
- `srat.js` — Jim Propp's S.R.A.T., 20Q × 5.
- `srt-1.js` — Patrick Honner's Simple Self-Referential Test, 5Q × 4.
- `srt-2.js` — Patrick Honner's Simple Self-Referential Test II, 10Q × 5.
- `srq-1.js` — Bubalo & Cubrilo's Self-Referential Quiz 1, 10Q × 5.
- `srq-2.js` — Brainzilla's Self-Referential Quiz 2, 10Q × 5.
- `srat-henz.js` — Henz 1996's 10-question SRAT, used as a worked example
  in the Mozart/Oz documentation.
- `suite.js` — imports every puzzle and runs them in sequence.

Each puzzle file is runnable standalone (`bun srat.js`); when imported,
only the puzzle data is exposed.

## How the solver works

A puzzle is `{ N, K, checks }`:
- `N` — number of variables (questions).
- `K` — domain size (answer letters per question).
- `checks` — `{ 1: predicate, 2: predicate, ... }` keyed by variable.

Variables are 1-indexed (`q[0]` is unused) with values in `1..K`. By
convention, value 1 is letter A, 2 is B, and so on. The search assigns
`q[1] … q[N]` in order, trying each value in `1..K`. After every
assignment, every relevant predicate runs and the branch is pruned on
any `false`.

### Three-valued predicates

The interesting bit is that each predicate inspects the partial
assignment `q` and returns one of:
- `true` — satisfied by the current partial assignment.
- `false` — violated; prune this branch.
- `"maybe"` — depends on still-unassigned variables; defer.

`"maybe"` is what lets the search prune early without forcing
predicates to be conservative. A constraint like "the number of E
answers is 3" fails as soon as a fourth E is placed, even with most
variables still unset; if only two E's are placed and many slots are
still open, the same predicate returns `"maybe"`.

### Helpers for count constraints

Many self-referential puzzles count occurrences of a letter or a set
of letters. Two helpers cover this cleanly:

- `countWith(q, pred)` returns `[n, unk]` — confirmed matches and
  still-empty slots.
- `inRange(n, unk, target)` returns a three-valued verdict: `true` if
  the count is exactly `target` with no unknowns left, `false` if no
  completion of the unknowns can reach `target` (either `n` already
  exceeds `target`, or `n + unk` falls short), and `"maybe"` otherwise.

So "the number of questions whose answer is E equals q[3] − 1" is a
one-liner:

    3: q => inRange(...countWith(q, v => v === E), q[3] - 1),

### A predicate may read its own answer directly

While `q[i] === 0`, the framework skips `checks[i]` entirely. So a
predicate body can read its own slot (`q[3]`, `q[6]`, …) without a
0-guard — by the time it runs, that slot is already filled. This keeps
the encodings short and direct: each predicate looks like a
straight transliteration of the English question.

### Performance

S.R.A.T.'s raw search space is 5²⁰ ≈ 10¹⁴. Three-valued pruning
collapses it to ~4k nodes and finishes in tens of milliseconds. The
10-question quizzes finish in single milliseconds. Real
self-referential puzzles in this style top out at 20 questions; the
count-constraints prune so aggressively that the search collapses fast.

## Running

    bun suite.js          # all five
    bun srat.js           # one in isolation

Output reports the puzzle name, number of solutions, search nodes
visited, wall time, and each solution as a sequence of letters.
