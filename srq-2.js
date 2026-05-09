// Self-Referential Quiz 2 (10Q × 5).
// https://www.brainzilla.com/logic/self-referential-quiz/srq-2/

import { report } from "./solver";

const A = 1, B = 2, C = 3, D = 4, E = 5;
const VALS = [A, B, C, D, E];

const puzzle = {
  name: "SRQ-2 (Brainzilla, 10Q × 5)",
  run: (amb, fail) =>
    amb(VALS, q1 =>
    amb(VALS, q2 =>
    amb(VALS, q3 =>
    amb(VALS, q4 =>
    amb(VALS, q5 =>
    amb(VALS, q6 =>
    amb(VALS, q7 =>
    amb(VALS, q8 => {
      const q18 = [null, q1, q2, q3, q4, q5, q6, q7, q8];
      // Q1: first D at 9 - q[1].
      const t1 = 9 - q1;
      if (q18[t1] !== D) return fail();
      if (q18.slice(1, t1).includes(D)) return fail();
      // Q2: q[a] = q[a+1] for chosen pair (no "only" claim).
      const [pa, pb] = [[3,4],[4,5],[5,6],[6,7],[7,8]][q2 - 1];
      if (q18[pa] !== q18[pb]) return fail();
      // Q7: |q[7] - q[8]| = 5 - q[7].
      if (Math.abs(q7 - q8) !== 5 - q7) return fail();
      // Q8: q[8] = q[q[8]]; q[8] ∈ {1..5}, q[1..5] all bound.
      if (q8 !== q18[q8]) return fail();
      return amb(VALS, q9 =>
      amb(VALS, q10 => {
        const q = [null, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10];
        const count = pred => q.slice(1).filter(pred).length;

        // Q3: count(E) = q[3].
        if (count(v => v === E) !== q3) return fail();
        // Q4: count(A) = q[4].
        const ca = count(v => v === A);
        if (ca !== q4) return fail();
        // Q5: count(A) = count(letter[q[5]]).
        if (count(v => v === q5) !== ca) return fail();
        // Q6: last B at q[6] + 4.
        const t6 = q6 + 4;
        if (q[t6] !== B) return fail();
        if (q.slice(t6 + 1, 11).includes(B)) return fail();
        // Q9: count(consonants) = q[9] + 2.
        if (count(v => v === B || v === C || v === D) !== q9 + 2)
          return fail();
        // Q10: tautology.
        return q;
      }));
    })))))))),
};

export default puzzle;
import.meta.main && report(puzzle);
