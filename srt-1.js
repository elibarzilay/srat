// Patrick Honner's Simple Self-Referential Test (5Q × 4).
// http://mrhonner.com/archives/8106

import { report } from "./solver";

const A = 1, B = 2, C = 3, D = 4;

const puzzle = {
  name: "SRT-1 (Honner, 5Q × 4)",
  run: (amb, fail) =>
    amb([A, B, C, D], q1 =>
    amb([A, B, C, D], q2 =>
    amb([A, B, C, D], q3 =>
    amb([A, B, C, D], q4 =>
    amb([A, B, C, D], q5 => {
      const q = [null, q1, q2, q3, q4, q5];

      // Q1: q[1] is the letter that appears in no other question.
      if (q.slice(2).includes(q[1])) return fail();

      // Q2: q[2]'s sole twin sits at target.
      const t2 = [5, 1, 3, 4][q[2] - 1];
      if (q[t2] !== q[2]) return fail();
      if ([1, 3, 4, 5].some(i => i !== t2 && q[i] === q[2])) return fail();

      // Q3: q[5] = [B,D,A,C][q[3]-1].
      if (q[5] !== [B, D, A, C][q[3] - 1]) return fail();

      // Q4: first A at q[4]+1.
      const t4 = q[4] + 1;
      if (q[t4] !== A) return fail();
      if (q.slice(1, t4).includes(A)) return fail();

      // Q5: q[3] = [C,B,D,A][q[5]-1].
      if (q[3] !== [C, B, D, A][q[5] - 1]) return fail();

      return q;
    }))))),
};

export default puzzle;
import.meta.main && report(puzzle);
