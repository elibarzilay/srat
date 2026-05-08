// Patrick Honner's Simple Self-Referential Test (5 questions, A..D).
// http://mrhonner.com/archives/8106

import { run } from "./solver";

const A = 1, B = 2, C = 3, D = 4;

const checks = {
  1: q => {                                     // q[1] is the letter unused in q[2..5]
    let unk = false;
    for (let i = 2; i <= 5; i++) {
      if (q[i] === q[1]) return false;
      if (q[i] === 0) unk = true;
    }
    return unk ? "maybe" : true;
  },
  2: q => {                                     // q[2]'s sole twin sits at target
    const t = [5, 1, 3, 4][q[2] - 1];
    if (q[t] !== 0 && q[t] !== q[2]) return false;
    let unk = q[t] === 0;
    for (let i = 1; i <= 5; i++) {
      if (i === 2 || i === t) continue;
      if (q[i] === q[2]) return false;
      if (q[i] === 0) unk = true;
    }
    return unk ? "maybe" : true;
  },
  3: q => {                                     // q[5] = [B,D,A,C][q[3]-1]
    const map = [B, D, A, C];
    return q[5] === 0 ? "maybe" : q[5] === map[q[3] - 1];
  },
  4: q => {                                     // first A at q[4]+1
    const t = q[4] + 1;
    if (q[t] !== 0 && q[t] !== A) return false;
    let unk = q[t] === 0;
    for (let i = 1; i < t; i++) {
      if (q[i] === A) return false;
      if (q[i] === 0) unk = true;
    }
    return unk ? "maybe" : true;
  },
  5: q => {                                     // q[3] = [C,B,D,A][q[5]-1]
    const map = [C, B, D, A];
    return q[3] === 0 ? "maybe" : q[3] === map[q[5] - 1];
  },
};

const puzzle = { name: "SRT-1 (Honner, 5Q × 4)", N: 5, K: 4, checks };
export default puzzle;
import.meta.main && run(puzzle);
