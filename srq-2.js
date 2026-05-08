// Self-Referential Quiz 2 (10Q × 5).
// https://www.brainzilla.com/logic/self-referential-quiz/srq-2/

import { report } from "./solver";

const A = 1, B = 2, C = 3, D = 4, E = 5;

const puzzle = {
  name: "SRQ-2 (Brainzilla, 10Q × 5)",
  run: (amb, fail) => {
    const pick = () => amb(A, B, C, D, E);
    const q = [];

    for (let i = 1; i <= 8; i++) q[i] = pick();

    // Q1: first D at 9 - q[1].
    const t1 = 9 - q[1];
    if (q[t1] !== D) fail();
    for (let i = 1; i < t1; i++) if (q[i] === D) fail();

    // Q2: q[a] = q[a+1] for chosen pair (no "only" claim).
    const pairs = [[3,4],[4,5],[5,6],[6,7],[7,8]];
    const [pa, pb] = pairs[q[2] - 1];
    if (q[pa] !== q[pb]) fail();

    // Q7: |q[7] - q[8]| = 5 - q[7].
    if (Math.abs(q[7] - q[8]) !== 5 - q[7]) fail();

    // Q8: q[8] = q[q[8]]; q[8] ∈ {1..5}, q[1..5] all bound.
    if (q[8] !== q[q[8]]) fail();

    q[9] = pick();
    q[10] = pick();
    const count = pred => q.slice(1).filter(pred).length;

    // Q3: count(E) = q[3].
    if (count(v => v === E) !== q[3]) fail();
    // Q4: count(A) = q[4].
    const ca = count(v => v === A);
    if (ca !== q[4]) fail();
    // Q5: count(A) = count(letter[q[5]]).
    if (count(v => v === q[5]) !== ca) fail();
    // Q6: last B at q[6] + 4.
    const t6 = q[6] + 4;
    if (q[t6] !== B) fail();
    for (let i = t6 + 1; i <= 10; i++) if (q[i] === B) fail();
    // Q9: count(consonants) = q[9] + 2.
    if (count(v => v === B || v === C || v === D) !== q[9] + 2) fail();
    // Q10: tautology.

    return q;
  },
};

export default puzzle;
import.meta.main && report(puzzle);
