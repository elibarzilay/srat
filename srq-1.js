// Self-Referential Quiz 1 by Maja Bubalo & Mirko Cubrilo (10Q × 5).
// https://www.brainzilla.com/logic/self-referential-quiz/srq-1/

import { report } from "./solver";

const A = 1, B = 2, C = 3, D = 4, E = 5;
const PRIMES = new Set([2, 3, 5, 7]);
const SQUARES = new Set([0, 1, 4, 9]);
const CUBES = new Set([0, 1, 8]);
const FACTORIALS = new Set([1, 2, 6]);
const VALS = [A, B, C, D, E];

const puzzle = {
  name: "SRQ-1 (Bubalo/Cubrilo, 10Q × 5)",
  run: (amb, fail) =>
    amb(VALS, q1 =>
    amb(VALS, q2 =>
    amb(VALS, q3 =>
    amb(VALS, q4 =>
    amb(VALS, q5 => {
      const q15 = [null, q1, q2, q3, q4, q5];
      // Q1: first E at q[1].
      if (q15[q1] !== E) return fail();
      if (q15.slice(1, q1).includes(E)) return fail();
      return amb(VALS, q6 =>
      amb(VALS, q7 => {
        // Q7: q[7] = q[q[7]].
        const q17 = [null, q1, q2, q3, q4, q5, q6, q7];
        if (q7 !== q17[q7]) return fail();
        return amb(VALS, q8 =>
        amb(VALS, q9 => {
          // Q8: |q[8]-q[9]| = 5 - q[8].
          if (Math.abs(q8 - q9) !== 5 - q8) return fail();
          // Q2: only odd-indexed B at target = [9,7,5,3,1][q[2]-1].
          const q19 = [null, q1, q2, q3, q4, q5, q6, q7, q8, q9];
          const t2 = [9, 7, 5, 3, 1][q2 - 1];
          if (q19[t2] !== B) return fail();
          if ([1, 3, 5, 7, 9].some(i => i !== t2 && q19[i] === B))
            return fail();
          // Q6: last odd-indexed match for q[6] at target = 2*q[6]-1.
          const t6 = 2 * q6 - 1;
          if (q19[t6] !== q6) return fail();
          if ([1, 3, 5, 7, 9].some(i => i > t6 && q19[i] === q6))
            return fail();
          return amb(VALS, q10 => {
            const q = [null, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10];
            const count = pred => q.slice(1).filter(pred).length;

            // Q3: only consecutive equal pair at pairs[q[3]-1].
            const [pa, pb] = [[2,3],[3,4],[4,5],[5,6],[6,7]][q3 - 1];
            if (q[pa] !== q[pb]) return fail();
            for (let i = 1; i < 10; i++) {
              if (i !== pa && q[i] === q[i + 1]) return fail();
            }
            // Q4: only even-indexed A at target = 2*q[4].
            const t4 = 2 * q4;
            if (q[t4] !== A) return fail();
            if ([2, 4, 6, 8, 10].some(i => i !== t4 && q[i] === A))
              return fail();
            // Q5: count(B) = 6 - q[5].
            if (count(v => v === B) !== 6 - q5) return fail();
            // Q9: consonant count: prime/square/cube/÷5/factorial.
            const cc = count(v => v === B || v === C || v === D);
            const ok9 = q9 === A ? PRIMES.has(cc)
                      : q9 === B ? SQUARES.has(cc)
                      : q9 === C ? CUBES.has(cc)
                      : q9 === D ? cc % 5 === 0
                      :            FACTORIALS.has(cc);
            if (!ok9) return fail();
            // Q10: tautology.
            return q;
          });
        }));
      }));
    }))))),
};

export default puzzle;
import.meta.main && report(puzzle);
