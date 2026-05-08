// Self-Referential Quiz 2 (10Q × 5).
// https://www.brainzilla.com/logic/self-referential-quiz/srq-2/

import { countWith, inRange, run } from "./solver";

const A = 1, B = 2, C = 3, D = 4, E = 5;

const checks = {
  1: q => {                                     // first D at 9-q[1]
    const t = 9 - q[1];
    if (q[t] !== 0 && q[t] !== D) return false;
    let unk = q[t] === 0;
    for (let i = 1; i < t; i++) {
      if (q[i] === D) return false;
      if (q[i] === 0) unk = true;
    }
    return unk ? "maybe" : true;
  },
  2: q => {                                     // q[a] = q[a+1] for chosen pair (no "only" claim)
    const pairs = [[3,4],[4,5],[5,6],[6,7],[7,8]];
    const [a, b] = pairs[q[2] - 1];
    if (q[a] && q[b] && q[a] !== q[b]) return false;
    return q[a] === 0 || q[b] === 0 ? "maybe" : true;
  },
  3: q => inRange(...countWith(q, v => v === E), q[3]),
  4: q => inRange(...countWith(q, v => v === A), q[4]),
  5: q => {                                     // count(A) = count(letter[q[5]])
    if (q[5] === A) return true;
    const cnt = [0, 0, 0, 0, 0, 0];
    let unk = 0;
    for (let i = 1; i <= 10; i++) {
      if (q[i] === 0) unk++;
      else cnt[q[i]]++;
    }
    return unk === 0 ? cnt[A] === cnt[q[5]] : "maybe";
  },
  6: q => {                                     // last B at q[6]+4
    const t = q[6] + 4;
    if (q[t] !== 0 && q[t] !== B) return false;
    let unk = q[t] === 0;
    for (let i = t + 1; i <= 10; i++) {
      if (q[i] === B) return false;
      if (q[i] === 0) unk = true;
    }
    return unk ? "maybe" : true;
  },
  7: q => q[8] === 0 ? "maybe" : Math.abs(q[7] - q[8]) === 5 - q[7],
  8: q => {                                     // q[8] = q[q[8]]
    const k = q[8];
    return q[k] === 0 ? "maybe" : q[k] === k;
  },
  9: q => inRange(...countWith(q, v => v === B || v === C || v === D), q[9] + 2),
  10: () => true,                               // tautology
};

const puzzle = { name: "SRQ-2 (Brainzilla, 10Q × 5)", N: 10, K: 5, checks };
export default puzzle;
import.meta.main && run(puzzle);
