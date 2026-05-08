// Patrick Honner's Simple Self-Referential Test II (10Q × 5).
// http://mrhonner.com/archives/8106

import { report } from "./solver";

const A = 1, B = 2, C = 3, D = 4, E = 5;
const PRIMES = new Set([2, 3, 5, 7]);
const SQUARES = new Set([0, 1, 4, 9]);

const puzzle = {
  name: "SRT-2 (Honner, 10Q × 5)",
  run: (amb, fail) => {
    const pick = () => amb(A, B, C, D, E);
    const q = [];

    for (let i = 1; i <= 5; i++) q[i] = pick();

    q[6] = pick();
    // Q4: q[6] = q[4].
    if (q[6] !== q[4]) fail();

    q[7] = pick();
    // Q5: q[5] = q[q[5]+2]; q[5]+2 ∈ {3..7}, all bound.
    if (q[5] !== q[q[5] + 2]) fail();
    // Q6: first B at q[6]+2; q[6]+2 ∈ {3..7}.
    const t6 = q[6] + 2;
    if (q[t6] !== B) fail();
    for (let i = 1; i < t6; i++) if (q[i] === B) fail();

    q[8] = pick();
    q[9] = pick();
    // Q8: |q[8] - q[9]| = 5 - q[8].
    if (Math.abs(q[8] - q[9]) !== 5 - q[8]) fail();

    q[10] = pick();
    const count = pred => q.slice(1).filter(pred).length;

    // Q3: q[10] = 6 - q[3].
    if (q[10] !== 6 - q[3]) fail();
    // Q10: q[3] = [C,D,A,B,E][q[10]-1].
    if (q[3] !== [C, D, A, B, E][q[10] - 1]) fail();
    // Q7: count(C) = q[7] - 1.
    if (count(v => v === C) !== q[7] - 1) fail();
    // Q2: count(A) = count(letter[q[2]+1]); E means all four match.
    const ca = count(v => v === A);
    if (q[2] === E) {
      for (const v of [B, C, D, E]) if (count(x => x === v) !== ca) fail();
    } else if (count(v => v === q[2] + 1) !== ca) fail();
    // Q9: vowel count is even/odd/prime/square/×5.
    const cv = count(v => v === A || v === E);
    const ok9 = q[9] === A ? cv % 2 === 0
              : q[9] === B ? cv % 2 === 1
              : q[9] === C ? PRIMES.has(cv)
              : q[9] === D ? SQUARES.has(cv)
              :              cv % 5 === 0;
    if (!ok9) fail();
    // Q1: tautology.

    return q;
  },
};

export default puzzle;
import.meta.main && report(puzzle);
