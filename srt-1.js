// Patrick Honner's Simple Self-Referential Test (5Q × 4).
// http://mrhonner.com/archives/8106

import { report } from "./solver";

const A = 1, B = 2, C = 3, D = 4;

const puzzle = {
  name: "SRT-1 (Honner, 5Q × 4)",
  run: (amb, fail) => {
    const q = [];
    for (let i = 1; i <= 5; i++) q[i] = amb(A, B, C, D);

    // Q1: q[1] is the letter that appears in no other question.
    for (let i = 2; i <= 5; i++) if (q[i] === q[1]) fail();

    // Q2: q[2]'s sole twin sits at target.
    const t2 = [5, 1, 3, 4][q[2] - 1];
    if (q[t2] !== q[2]) fail();
    for (let i = 1; i <= 5; i++) {
      if (i === 2 || i === t2) continue;
      if (q[i] === q[2]) fail();
    }

    // Q3: q[5] = [B,D,A,C][q[3]-1].
    if (q[5] !== [B, D, A, C][q[3] - 1]) fail();

    // Q4: first A at q[4]+1.
    const t4 = q[4] + 1;
    if (q[t4] !== A) fail();
    for (let i = 1; i < t4; i++) if (q[i] === A) fail();

    // Q5: q[3] = [C,B,D,A][q[5]-1].
    if (q[3] !== [C, B, D, A][q[5] - 1]) fail();

    return q;
  },
};

export default puzzle;
import.meta.main && report(puzzle);
