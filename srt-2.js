// Patrick Honner's Simple Self-Referential Test II (10Q × 5).
// http://mrhonner.com/archives/8106

import { report } from "./solver";

const A = 1, B = 2, C = 3, D = 4, E = 5;
const PRIMES = new Set([2, 3, 5, 7]);
const SQUARES = new Set([0, 1, 4, 9]);
const VALS = [A, B, C, D, E];

const puzzle = {
  name: "SRT-2 (Honner, 10Q × 5)",
  run: (amb, fail) =>
    amb(VALS, q1 =>
    amb(VALS, q2 =>
    amb(VALS, q3 =>
    amb(VALS, q4 =>
    amb(VALS, q5 =>
    amb(VALS, q6 => {
      // Q4: q[6] = q[4].
      if (q6 !== q4) return fail();
      return amb(VALS, q7 => {
        // Q5: q[5] = q[q[5]+2]; q[5]+2 ∈ {3..7}, all bound.
        const q57 = [null, q1, q2, q3, q4, q5, q6, q7];
        if (q5 !== q57[q5 + 2]) return fail();
        // Q6: first B at q[6]+2; q[6]+2 ∈ {3..7}.
        const t6 = q6 + 2;
        if (q57[t6] !== B) return fail();
        if (q57.slice(1, t6).includes(B)) return fail();
        return amb(VALS, q8 =>
        amb(VALS, q9 => {
          // Q8: |q[8] - q[9]| = 5 - q[8].
          if (Math.abs(q8 - q9) !== 5 - q8) return fail();
          return amb(VALS, q10 => {
            const q = [null, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10];
            const count = pred => q.slice(1).filter(pred).length;

            // Q3: q[10] = 6 - q[3].
            if (q10 !== 6 - q3) return fail();
            // Q10: q[3] = [C,D,A,B,E][q[10]-1].
            if (q3 !== [C, D, A, B, E][q10 - 1]) return fail();
            // Q7: count(C) = q[7] - 1.
            if (count(v => v === C) !== q7 - 1) return fail();
            // Q2: count(A) = count(letter[q[2]+1]); E means all match.
            const ca = count(v => v === A);
            if (q2 === E) {
              if ([B,C,D,E].some(v => count(x => x === v) !== ca)) return fail();
            } else if (count(v => v === q2 + 1) !== ca) return fail();
            // Q9: vowel count is even/odd/prime/square/×5.
            const cv = count(v => v === A || v === E);
            const ok9 = q9 === A ? cv % 2 === 0
                      : q9 === B ? cv % 2 === 1
                      : q9 === C ? PRIMES.has(cv)
                      : q9 === D ? SQUARES.has(cv)
                      :            cv % 5 === 0;
            if (!ok9) return fail();
            // Q1: tautology.
            return q;
          });
        }));
      });
    })))))),
};

export default puzzle;
import.meta.main && report(puzzle);
