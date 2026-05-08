// Self-Referential Aptitude Test from Henz 1996, used as a worked example
// in the Mozart/Oz documentation (10Q × 5).
// https://mozart.github.io/mozart-v1/doc-1.4.0/fdt/node38.html

import { countWith, inRange, run } from "./solver";

const A = 1, B = 2, C = 3, D = 4, E = 5;
const PRIMES = new Set([2, 3, 5, 7]);
const SQUARES = new Set([0, 1, 4, 9]);
const CUBES = new Set([0, 1, 8]);
const FACTORIALS = new Set([1, 2, 6]);

const checks = {
  1: q => {                                     // first B at q[1]+1
    const t = q[1] + 1;
    if (q[t] !== 0 && q[t] !== B) return false;
    let unk = q[t] === 0;
    for (let i = 1; i < t; i++) {
      if (q[i] === B) return false;
      if (q[i] === 0) unk = true;
    }
    return unk ? "maybe" : true;
  },
  2: q => {                                     // unique consecutive equal pair
    const pairs = [[2,3],[3,4],[4,5],[5,6],[6,7]];
    const [a, b] = pairs[q[2] - 1];
    let unk = q[a] === 0 || q[b] === 0;
    if (q[a] && q[b] && q[a] !== q[b]) return false;
    for (let i = 1; i < 10; i++) {
      if (i === a) continue;
      if (q[i] && q[i+1] && q[i] === q[i+1]) return false;
      if (q[i] === 0 || q[i+1] === 0) unk = true;
    }
    return unk ? "maybe" : true;
  },
  3: q => {                                     // q[3] = q[[1,2,4,7,6][q[3]-1]]
    const t = [1, 2, 4, 7, 6][q[3] - 1];
    return q[t] === 0 ? "maybe" : q[t] === q[3];
  },
  4: q => inRange(...countWith(q, v => v === A), q[4] - 1),
  5: q => {                                     // q[5] = q[11-q[5]]
    const t = 11 - q[5];
    return q[t] === 0 ? "maybe" : q[t] === q[5];
  },
  6: q => {                                     // count(A) = count(letter[q[6]+1]); E = none
    const cnt = [0, 0, 0, 0, 0, 0];
    let unk = 0;
    for (let i = 1; i <= 10; i++) {
      if (q[i] === 0) unk++;
      else cnt[q[i]]++;
    }
    if (q[6] === E) return unk
      ? "maybe"
      : [B, C, D, E].every(v => cnt[A] !== cnt[v]);
    return unk === 0 ? cnt[A] === cnt[q[6] + 1] : "maybe";
  },
  7: q => q[8] === 0 ? "maybe" : Math.abs(q[7] - q[8]) === 5 - q[7],
  8: q => inRange(...countWith(q, v => v === A || v === E), q[8] + 1),
  9: q => {                                     // consonant count: prime/fact/sq/cube/÷5
    const [n, unk] = countWith(q, v => v === B || v === C || v === D);
    const test = c => q[9] === A ? PRIMES.has(c)
                    : q[9] === B ? FACTORIALS.has(c)
                    : q[9] === C ? SQUARES.has(c)
                    : q[9] === D ? CUBES.has(c)
                    :              c % 5 === 0;
    if (unk === 0) return test(n);
    for (let k = 0; k <= unk; k++) if (test(n + k)) return "maybe";
    return false;
  },
  10: () => true,                               // tautology
};

const puzzle = { name: "SRAT (Henz, 10Q × 5)", N: 10, K: 5, checks };
export default puzzle;
import.meta.main && run(puzzle);
