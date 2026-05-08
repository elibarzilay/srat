// Self-Referential Aptitude Test from Henz 1996, used as a worked example
// in the Mozart/Oz documentation (10Q × 5).
// https://mozart.github.io/mozart-v1/doc-1.4.0/fdt/node38.html

import { report } from "./solver";

const A = 1, B = 2, C = 3, D = 4, E = 5;
const PRIMES = new Set([2, 3, 5, 7]);
const SQUARES = new Set([0, 1, 4, 9]);
const CUBES = new Set([0, 1, 8]);
const FACTORIALS = new Set([1, 2, 6]);

const puzzle = {
  name: "SRAT (Henz, 10Q × 5)",
  run: (amb, fail) => {
    const pick = () => amb(A, B, C, D, E);
    const q = [];

    for (let i = 1; i <= 6; i++) q[i] = pick();

    // Q1: first B at q[1] + 1.
    const t1 = q[1] + 1;
    if (q[t1] !== B) fail();
    for (let i = 1; i < t1; i++) if (q[i] === B) fail();

    q[7] = pick();
    // Q3: q[3] = q[t3]; t3 = [1,2,4,7,6][q[3]-1].
    const t3 = [1, 2, 4, 7, 6][q[3] - 1];
    if (q[t3] !== q[3]) fail();

    q[8] = pick();
    // Q7: |q[7] - q[8]| = 5 - q[7].
    if (Math.abs(q[7] - q[8]) !== 5 - q[7]) fail();

    q[9] = pick();
    q[10] = pick();
    const count = pred => q.slice(1).filter(pred).length;

    // Q2: only consecutive equal pair at pairs[q[2]-1].
    const pairs = [[2,3],[3,4],[4,5],[5,6],[6,7]];
    const [pa, pb] = pairs[q[2] - 1];
    if (q[pa] !== q[pb]) fail();
    for (let i = 1; i < 10; i++) {
      if (i === pa) continue;
      if (q[i] === q[i+1]) fail();
    }
    // Q4: count(A) = q[4] - 1.
    const ca = count(v => v === A);
    if (ca !== q[4] - 1) fail();
    // Q5: q[5] = q[11 - q[5]].
    if (q[5] !== q[11 - q[5]]) fail();
    // Q6: count(A) = count(letter[q[6]+1]); E means none match.
    if (q[6] === E) {
      for (const v of [B, C, D, E]) if (count(x => x === v) === ca) fail();
    } else if (count(v => v === q[6] + 1) !== ca) fail();
    // Q8: count(vowels) = q[8] + 1.
    if (count(v => v === A || v === E) !== q[8] + 1) fail();
    // Q9: consonant count is prime/factorial/square/cube/÷5.
    const cc = count(v => v === B || v === C || v === D);
    const ok9 = q[9] === A ? PRIMES.has(cc)
              : q[9] === B ? FACTORIALS.has(cc)
              : q[9] === C ? SQUARES.has(cc)
              : q[9] === D ? CUBES.has(cc)
              :              cc % 5 === 0;
    if (!ok9) fail();
    // Q10: tautology.

    return q;
  },
};

export default puzzle;
import.meta.main && report(puzzle);
