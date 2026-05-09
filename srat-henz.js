// Self-Referential Aptitude Test from Henz 1996, used as a worked example
// in the Mozart/Oz documentation (10Q × 5).
// https://mozart.github.io/mozart-v1/doc-1.4.0/fdt/node38.html

import { report } from "./solver";

const A = 1, B = 2, C = 3, D = 4, E = 5;
const PRIMES = new Set([2, 3, 5, 7]);
const SQUARES = new Set([0, 1, 4, 9]);
const CUBES = new Set([0, 1, 8]);
const FACTORIALS = new Set([1, 2, 6]);
const VALS = [A, B, C, D, E];

const puzzle = {
  name: "SRAT (Henz, 10Q × 5)",
  run: (amb, fail) =>
    amb(VALS, q1 =>
    amb(VALS, q2 =>
    amb(VALS, q3 =>
    amb(VALS, q4 =>
    amb(VALS, q5 =>
    amb(VALS, q6 => {
      const q16 = [null, q1, q2, q3, q4, q5, q6];
      // Q1: first B at q[1] + 1.
      const t1 = q1 + 1;
      if (q16[t1] !== B) return fail();
      if (q16.slice(1, t1).includes(B)) return fail();
      return amb(VALS, q7 => {
        // Q3: q[3] = q[t3]; t3 = [1,2,4,7,6][q[3]-1].
        const q17 = [null, q1, q2, q3, q4, q5, q6, q7];
        const t3 = [1, 2, 4, 7, 6][q3 - 1];
        if (q17[t3] !== q3) return fail();
        return amb(VALS, q8 => {
          // Q7: |q[7]-q[8]| = 5 - q[7].
          if (Math.abs(q7 - q8) !== 5 - q7) return fail();
          return amb(VALS, q9 =>
          amb(VALS, q10 => {
            const q = [null, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10];
            const count = pred => q.slice(1).filter(pred).length;

            // Q2: only consecutive equal pair at pairs[q[2]-1].
            const [pa, pb] = [[2,3],[3,4],[4,5],[5,6],[6,7]][q2 - 1];
            if (q[pa] !== q[pb]) return fail();
            for (let i = 1; i < 10; i++) {
              if (i !== pa && q[i] === q[i + 1]) return fail();
            }
            // Q4: count(A) = q[4] - 1.
            const ca = count(v => v === A);
            if (ca !== q4 - 1) return fail();
            // Q5: q[5] = q[11 - q[5]].
            if (q5 !== q[11 - q5]) return fail();
            // Q6: count(A) = count(letter[q[6]+1]); E means none match.
            if (q6 === E) {
              if ([B,C,D,E].some(v => count(x => x === v) === ca))
                return fail();
            } else if (count(v => v === q6 + 1) !== ca) return fail();
            // Q8: count(vowels) = q[8] + 1.
            if (count(v => v === A || v === E) !== q8 + 1) return fail();
            // Q9: consonant count is prime/factorial/square/cube/÷5.
            const cc = count(v => v === B || v === C || v === D);
            const ok9 = q9 === A ? PRIMES.has(cc)
                      : q9 === B ? FACTORIALS.has(cc)
                      : q9 === C ? SQUARES.has(cc)
                      : q9 === D ? CUBES.has(cc)
                      :            cc % 5 === 0;
            if (!ok9) return fail();
            // Q10: tautology.
            return q;
          }));
        });
      });
    })))))),
};

export default puzzle;
import.meta.main && report(puzzle);
