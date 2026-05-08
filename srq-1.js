// Self-Referential Quiz 1 by Maja Bubalo & Mirko Cubrilo (10Q × 5).
// https://www.brainzilla.com/logic/self-referential-quiz/srq-1/

import { countWith, inRange, run } from "./solver";

const A = 1, B = 2, C = 3, D = 4, E = 5;
const PRIMES = new Set([2, 3, 5, 7]);
const SQUARES = new Set([0, 1, 4, 9]);
const CUBES = new Set([0, 1, 8]);
const FACTORIALS = new Set([1, 2, 6]);

const checks = {
  1: q => {                                     // first E at q[1]
    const k = q[1];
    if (q[k] !== 0 && q[k] !== E) return false;
    let unk = q[k] === 0;
    for (let i = 1; i < k; i++) {
      if (q[i] === E) return false;
      if (q[i] === 0) unk = true;
    }
    return unk ? "maybe" : true;
  },
  2: q => {                                     // unique odd-indexed B at target
    const t = [9, 7, 5, 3, 1][q[2] - 1];
    if (q[t] !== 0 && q[t] !== B) return false;
    let unk = q[t] === 0;
    for (let i = 1; i <= 9; i += 2) {
      if (i === t) continue;
      if (q[i] === B) return false;
      if (q[i] === 0) unk = true;
    }
    return unk ? "maybe" : true;
  },
  3: q => {                                     // unique consecutive equal pair
    const pairs = [[2,3],[3,4],[4,5],[5,6],[6,7]];
    const [a, b] = pairs[q[3] - 1];
    let unk = q[a] === 0 || q[b] === 0;
    if (q[a] && q[b] && q[a] !== q[b]) return false;
    for (let i = 1; i < 10; i++) {
      if (i === a) continue;
      if (q[i] && q[i+1] && q[i] === q[i+1]) return false;
      if (q[i] === 0 || q[i+1] === 0) unk = true;
    }
    return unk ? "maybe" : true;
  },
  4: q => {                                     // unique even-indexed A at target
    const t = 2 * q[4];
    if (q[t] !== 0 && q[t] !== A) return false;
    let unk = q[t] === 0;
    for (let i = 2; i <= 10; i += 2) {
      if (i === t) continue;
      if (q[i] === A) return false;
      if (q[i] === 0) unk = true;
    }
    return unk ? "maybe" : true;
  },
  5: q => inRange(...countWith(q, v => v === B), 6 - q[5]),
  6: q => {                                     // last odd-indexed match for q[6] is at target
    const t = 2 * q[6] - 1;
    if (q[t] !== 0 && q[t] !== q[6]) return false;
    let unk = q[t] === 0;
    for (let i = t + 2; i <= 9; i += 2) {
      if (q[i] === q[6]) return false;
      if (q[i] === 0) unk = true;
    }
    return unk ? "maybe" : true;
  },
  7: q => {                                     // q[7] = q[q[7]]
    const k = q[7];
    return q[k] === 0 ? "maybe" : q[k] === k;
  },
  8: q => q[9] === 0 ? "maybe" : Math.abs(q[8] - q[9]) === 5 - q[8],
  9: q => {                                     // consonant count: prime/sq/cube/÷5/factorial
    const [n, unk] = countWith(q, v => v === B || v === C || v === D);
    const test = c => q[9] === A ? PRIMES.has(c)
                    : q[9] === B ? SQUARES.has(c)
                    : q[9] === C ? CUBES.has(c)
                    : q[9] === D ? c % 5 === 0
                    :              FACTORIALS.has(c);
    if (unk === 0) return test(n);
    for (let k = 0; k <= unk; k++) if (test(n + k)) return "maybe";
    return false;
  },
  10: () => true,                               // tautology
};

const puzzle = { name: "SRQ-1 (Bubalo/Cubrilo, 10Q × 5)", N: 10, K: 5, checks };
export default puzzle;
import.meta.main && run(puzzle);
