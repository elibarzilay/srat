// Patrick Honner's Simple Self-Referential Test II (10 questions, A..E).
// http://mrhonner.com/archives/8106

import { countWith, inRange, run } from "./solver";

const A = 1, B = 2, C = 3, D = 4, E = 5;
const PRIMES = new Set([2, 3, 5, 7]);
const SQUARES = new Set([0, 1, 4, 9]);

const checks = {
  1: () => true,                                // tautology
  2: q => {                                     // count(A) = count(letter[q[2]+1]); E = all
    const cnt = [0, 0, 0, 0, 0, 0];
    let unk = 0;
    for (let i = 1; i <= 10; i++) {
      if (q[i] === 0) unk++;
      else cnt[q[i]]++;
    }
    if (q[2] === E) return unk
      ? "maybe"
      : [B, C, D, E].every(v => cnt[A] === cnt[v]);
    return unk === 0 ? cnt[A] === cnt[q[2] + 1] : "maybe";
  },
  3: q => q[10] === 0 ? "maybe" : q[10] === 6 - q[3],
  4: q => q[6] === 0 ? "maybe" : q[6] === q[4],
  5: q => {                                     // q[5] = q[q[5]+2]
    const t = q[5] + 2;
    return q[t] === 0 ? "maybe" : q[5] === q[t];
  },
  6: q => {                                     // first B at q[6]+2
    const t = q[6] + 2;
    if (q[t] !== 0 && q[t] !== B) return false;
    let unk = q[t] === 0;
    for (let i = 1; i < t; i++) {
      if (q[i] === B) return false;
      if (q[i] === 0) unk = true;
    }
    return unk ? "maybe" : true;
  },
  7: q => inRange(...countWith(q, v => v === C), q[7] - 1),
  8: q => q[9] === 0 ? "maybe" : Math.abs(q[8] - q[9]) === 5 - q[8],
  9: q => {                                     // vowel count: even/odd/prime/sq/×5
    const [n, unk] = countWith(q, v => v === A || v === E);
    const test = c => q[9] === A ? c % 2 === 0
                    : q[9] === B ? c % 2 === 1
                    : q[9] === C ? PRIMES.has(c)
                    : q[9] === D ? SQUARES.has(c)
                    :              c % 5 === 0;
    if (unk === 0) return test(n);
    for (let k = 0; k <= unk; k++) if (test(n + k)) return "maybe";
    return false;
  },
  10: q => {                                    // q[3] = [C,D,A,B,E][q[10]-1]
    const map = [C, D, A, B, E];
    return q[3] === 0 ? "maybe" : q[3] === map[q[10] - 1];
  },
};

const puzzle = { name: "SRT-2 (Honner, 10Q × 5)", N: 10, K: 5, checks };
export default puzzle;
import.meta.main && run(puzzle);
