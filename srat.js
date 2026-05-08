// Self-Referential Aptitude Test (Jim Propp, 1993). 20Q × 5.
// https://faculty.uml.edu/jpropp/srat.html

import { report } from "./solver";

const A = 1, B = 2, C = 3, D = 4, E = 5;
const PRIMES = new Set([2, 3, 5, 7, 11, 13, 17, 19]);
const SQUARES = new Set([0, 1, 4, 9, 16]);

const puzzle = {
  name: "SRAT (Propp, 20Q × 5)",
  run: (amb, fail) => {
    const pick = () => amb(A, B, C, D, E);
    const q = [];

    for (let i = 1; i <= 5; i++) q[i] = pick();

    // Q1: first B at q[1].
    if (q[q[1]] !== B) fail();
    for (let i = 1; i < q[1]; i++) if (q[i] === B) fail();
    // Q5: q[5] = q[q[5]]; trivial when q[5] = E.
    if (q[5] !== E && q[q[5]] !== q[5]) fail();

    q[6] = pick();
    q[7] = pick();
    q[8] = pick();
    // Q7: |q[7] - q[8]| = 5 - q[7].
    if (Math.abs(q[7] - q[8]) !== 5 - q[7]) fail();

    q[9] = pick();
    q[10] = pick();
    q[11] = pick();
    // Q11: count(B in q[1..10]) = q[11] - 1.
    let cb = 0;
    for (let i = 1; i <= 10; i++) if (q[i] === B) cb++;
    if (cb !== q[11] - 1) fail();

    q[12] = pick();
    q[13] = pick();
    q[14] = pick();
    // Q9: next match for q[9] at q[9] + 9 ∈ {10..14}.
    const t9 = q[9] + 9;
    if (q[t9] !== q[9]) fail();
    for (let i = 10; i < t9; i++) if (q[i] === q[9]) fail();

    q[15] = pick();
    // Q15: q[12] = q[15].
    if (q[12] !== q[15]) fail();

    q[16] = pick();
    // Q10: q[16] = [D,A,E,B,C][q[10]-1].
    if (q[16] !== [D, A, E, B, C][q[10] - 1]) fail();
    // Q16: q[10] = [D,C,B,A,E][q[16]-1].
    if (q[10] !== [D, C, B, A, E][q[16] - 1]) fail();

    q[17] = pick();
    // Q6: q[17] determined by q[6]; E impossible.
    if (q[6] === E) fail();
    if (q[6] === A && q[17] !== C) fail();
    if (q[6] === B && q[17] !== D) fail();
    if (q[6] === C && q[17] !== E) fail();
    if (q[6] === D && (q[17] === C || q[17] === D || q[17] === E)) fail();
    // Q17: same shape, q[6] determined by q[17].
    if (q[17] === E) fail();
    if (q[17] === A && q[6] !== C) fail();
    if (q[17] === B && q[6] !== D) fail();
    if (q[17] === C && q[6] !== E) fail();
    if (q[17] === D && (q[6] === C || q[6] === D || q[6] === E)) fail();

    q[18] = pick();
    q[19] = pick();
    // Q13: unique odd-A at 2*q[13] + 7 ∈ {9,11,13,15,17}.
    const t13 = 2 * q[13] + 7;
    if (q[t13] !== A) fail();
    for (let i = 1; i <= 19; i += 2) {
      if (i === t13) continue;
      if (q[i] === A) fail();
    }

    q[20] = pick();
    const count = pred => q.slice(1).filter(pred).length;

    // Q2: only consecutive equal pair at pairs[q[2]-1].
    const pairs = [[6,7],[7,8],[8,9],[9,10],[10,11]];
    const [pa, pb] = pairs[q[2] - 1];
    if (q[pa] !== q[pb]) fail();
    for (let i = 1; i < 20; i++) {
      if (i === pa) continue;
      if (q[i] === q[i+1]) fail();
    }
    // Q3: count(E) = q[3] - 1.
    if (count(v => v === E) !== q[3] - 1) fail();
    // Q4: count(A) = q[4] + 3.
    const ca = count(v => v === A);
    if (ca !== q[4] + 3) fail();
    // Q8: count(vowels) = q[8] + 3.
    if (count(v => v === A || v === E) !== q[8] + 3) fail();
    // Q12: consonant count is even/odd/square/prime/×5.
    const cc = count(v => v === B || v === C || v === D);
    const ok12 = q[12] === A ? cc % 2 === 0
               : q[12] === B ? cc % 2 === 1
               : q[12] === C ? SQUARES.has(cc)
               : q[12] === D ? PRIMES.has(cc)
               :               cc % 5 === 0;
    if (!ok12) fail();
    // Q14: count(D) = q[14] + 5.
    if (count(v => v === D) !== q[14] + 5) fail();
    // Q18: count(A) = count(letter[q[18]+1]); E = none match.
    if (q[18] === E) {
      for (const v of [B, C, D, E]) if (count(x => x === v) === ca) fail();
    } else if (count(v => v === q[18] + 1) !== ca) fail();
    // Q19, Q20: tautologies.

    return q;
  },
};

export default puzzle;
import.meta.main && report(puzzle);
