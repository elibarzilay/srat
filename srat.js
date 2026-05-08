// Self-Referential Aptitude Test (Jim Propp, 1993). 20Q × 5.
// https://faculty.uml.edu/jpropp/srat.html

import { countWith, inRange, run } from "./solver";

const A = 1, B = 2, C = 3, D = 4, E = 5;
const PRIMES = new Set([2, 3, 5, 7, 11, 13, 17, 19]);
const SQUARES = new Set([0, 1, 4, 9, 16]);

const checks = {
  1: q => {                                     // first B sits at q[1]
    const k = q[1];
    for (let i = 1; i < k; i++) if (q[i] === B) return false;
    if (q[k] !== 0 && q[k] !== B) return false;
    if (q[k] === 0) return "maybe";
    for (let i = 1; i < k; i++) if (q[i] === 0) return "maybe";
    return true;
  },
  2: q => {                                     // unique consecutive equal pair
    const pairs = [[6,7],[7,8],[8,9],[9,10],[10,11]];
    const [a, b] = pairs[q[2] - 1];
    let unk = q[a] === 0 || q[b] === 0;
    if (q[a] && q[b] && q[a] !== q[b]) return false;
    for (let i = 1; i < 20; i++) {
      if (i === a) continue;
      if (q[i] && q[i+1] && q[i] === q[i+1]) return false;
      if (q[i] === 0 || q[i+1] === 0) unk = true;
    }
    return unk ? "maybe" : true;
  },
  3: q => inRange(...countWith(q, v => v === E), q[3] - 1),
  4: q => inRange(...countWith(q, v => v === A), q[4] + 3),
  5: q => {                                     // q[5] === q[q[5]]; trivial when E
    const k = q[5];
    if (k === E) return true;
    return q[k] === 0 ? "maybe" : q[k] === k;
  },
  6: q => {
    const r = q[17];
    if (q[6] === E) return false;               // "all of the above" impossible
    if (r === 0) return "maybe";
    return q[6] === A ? r === C
         : q[6] === B ? r === D
         : q[6] === C ? r === E
         :              r !== C && r !== D && r !== E;
  },
  7: q => q[8] === 0 ? "maybe" : Math.abs(q[7] - q[8]) === 5 - q[7],
  8: q => inRange(...countWith(q, v => v === A || v === E), q[8] + 3),
  9: q => {                                     // next match at 10..14
    const t = q[9] + 9;
    if (q[t] !== 0 && q[t] !== q[9]) return false;
    for (let i = 10; i < t; i++) if (q[i] === q[9]) return false;
    if (q[t] === 0) return "maybe";
    for (let i = 10; i < t; i++) if (q[i] === 0) return "maybe";
    return true;
  },
  10: q => {
    const map = [D, A, E, B, C];
    return q[16] === 0 ? "maybe" : q[16] === map[q[10] - 1];
  },
  11: q => {                                    // count B in q[1..10]
    let n = 0, unk = 0;
    for (let i = 1; i <= 10; i++) {
      if (q[i] === 0) unk++;
      else if (q[i] === B) n++;
    }
    return inRange(n, unk, q[11] - 1);
  },
  12: q => {                                    // consonant count: even/odd/sq/prime/÷5
    const [n, unk] = countWith(q, v => v === B || v === C || v === D);
    const test = c => q[12] === A ? c % 2 === 0
                    : q[12] === B ? c % 2 === 1
                    : q[12] === C ? SQUARES.has(c)
                    : q[12] === D ? PRIMES.has(c)
                    :               c % 5 === 0;
    if (unk === 0) return test(n);
    for (let k = 0; k <= unk; k++) if (test(n + k)) return "maybe";
    return false;
  },
  13: q => {                                    // unique odd q[i]=A at 9,11,13,15,17
    const t = 2 * q[13] + 7;
    if (q[t] !== 0 && q[t] !== A) return false;
    let unk = q[t] === 0;
    for (let i = 1; i <= 19; i += 2) {
      if (i === t) continue;
      if (q[i] === A) return false;
      if (q[i] === 0) unk = true;
    }
    return unk ? "maybe" : true;
  },
  14: q => inRange(...countWith(q, v => v === D), q[14] + 5),
  15: q => q[12] === 0 ? "maybe" : q[12] === q[15],
  16: q => {
    const map = [D, C, B, A, E];
    return q[10] === 0 ? "maybe" : q[10] === map[q[16] - 1];
  },
  17: q => {
    const r = q[6];
    if (q[17] === E) return false;
    if (r === 0) return "maybe";
    return q[17] === A ? r === C
         : q[17] === B ? r === D
         : q[17] === C ? r === E
         :               r !== C && r !== D && r !== E;
  },
  18: q => {
    const cnt = [0, 0, 0, 0, 0, 0];
    let unk = 0;
    for (let i = 1; i <= 20; i++) {
      if (q[i] === 0) unk++;
      else cnt[q[i]]++;
    }
    if (q[18] === E) return unk
      ? "maybe"
      : [B, C, D, E].every(v => cnt[A] !== cnt[v]);
    const v = q[18] + 1;                        // A→B, B→C, C→D, D→E
    return unk === 0 ? cnt[A] === cnt[v] : "maybe";
  },
  19: () => true,                               // tautology
  20: () => true,                               // unconstrained joke question
};

const puzzle = { name: "SRAT (Propp, 20Q × 5)", N: 20, K: 5, checks };
export default puzzle;
import.meta.main && run(puzzle);
