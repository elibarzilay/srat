// Self-Referential Quiz 1 by Maja Bubalo & Mirko Cubrilo (10Q × 5).
// https://www.brainzilla.com/logic/self-referential-quiz/srq-1/

import { report } from "./solver";

const A = 1, B = 2, C = 3, D = 4, E = 5;
const PRIMES = new Set([2, 3, 5, 7]);
const SQUARES = new Set([0, 1, 4, 9]);
const CUBES = new Set([0, 1, 8]);
const FACTORIALS = new Set([1, 2, 6]);

const puzzle = {
  name: "SRQ-1 (Bubalo/Cubrilo, 10Q × 5)",
  run: (amb, fail) => {
    const pick = () => amb(A, B, C, D, E);
    const q = [];

    for (let i = 1; i <= 5; i++) q[i] = pick();

    // Q1: first E at q[1].
    if (q[q[1]] !== E) fail();
    for (let i = 1; i < q[1]; i++) if (q[i] === E) fail();

    q[6] = pick();
    q[7] = pick();
    // Q7: q[7] = q[q[7]].
    if (q[7] !== q[q[7]]) fail();

    q[8] = pick();
    q[9] = pick();
    // Q8: |q[8] - q[9]| = 5 - q[8].
    if (Math.abs(q[8] - q[9]) !== 5 - q[8]) fail();
    // Q2: only odd-indexed B at target = [9,7,5,3,1][q[2]-1].
    const t2 = [9, 7, 5, 3, 1][q[2] - 1];
    if (q[t2] !== B) fail();
    for (let i = 1; i <= 9; i += 2) {
      if (i === t2) continue;
      if (q[i] === B) fail();
    }
    // Q6: last odd-indexed match for q[6] at target = 2*q[6]-1.
    const t6 = 2 * q[6] - 1;
    if (q[t6] !== q[6]) fail();
    for (let i = t6 + 2; i <= 9; i += 2) if (q[i] === q[6]) fail();

    q[10] = pick();
    const count = pred => q.slice(1).filter(pred).length;

    // Q3: only consecutive equal pair at pairs[q[3]-1].
    const pairs = [[2,3],[3,4],[4,5],[5,6],[6,7]];
    const [pa, pb] = pairs[q[3] - 1];
    if (q[pa] !== q[pb]) fail();
    for (let i = 1; i < 10; i++) {
      if (i === pa) continue;
      if (q[i] === q[i+1]) fail();
    }
    // Q4: only even-indexed A at target = 2*q[4].
    const t4 = 2 * q[4];
    if (q[t4] !== A) fail();
    for (let i = 2; i <= 10; i += 2) {
      if (i === t4) continue;
      if (q[i] === A) fail();
    }
    // Q5: count(B) = 6 - q[5].
    if (count(v => v === B) !== 6 - q[5]) fail();
    // Q9: consonant count is prime/square/cube/÷5/factorial.
    const cc = count(v => v === B || v === C || v === D);
    const ok9 = q[9] === A ? PRIMES.has(cc)
              : q[9] === B ? SQUARES.has(cc)
              : q[9] === C ? CUBES.has(cc)
              : q[9] === D ? cc % 5 === 0
              :              FACTORIALS.has(cc);
    if (!ok9) fail();
    // Q10: tautology.

    return q;
  },
};

export default puzzle;
import.meta.main && report(puzzle);
