// Self-Referential Aptitude Test (Jim Propp, 1993). 20Q × 5.
// https://faculty.uml.edu/jpropp/srat.html

import { report } from "./solver";

const A = 1, B = 2, C = 3, D = 4, E = 5;
const PRIMES = new Set([2, 3, 5, 7, 11, 13, 17, 19]);
const SQUARES = new Set([0, 1, 4, 9, 16]);
const VALS = [A, B, C, D, E];

const puzzle = {
  name: "SRAT (Propp, 20Q × 5)",
  run: (amb, fail) =>
    amb(VALS, q1 =>
    amb(VALS, q2 =>
    amb(VALS, q3 =>
    amb(VALS, q4 =>
    amb(VALS, q5 => {
      const q = [null, q1, q2, q3, q4, q5];
      // Q1: first B at q[1].
      if (q[q1] !== B) return fail();
      if (q.slice(1, q1).includes(B)) return fail();
      // Q5: q[5] = q[q[5]]; trivial when q[5] = E.
      if (q5 !== E && q[q5] !== q5) return fail();
      return amb(VALS, q6 =>
      amb(VALS, q7 =>
      amb(VALS, q8 => {
        // Q7: |q[7] - q[8]| = 5 - q[7].
        if (Math.abs(q7 - q8) !== 5 - q7) return fail();
        return amb(VALS, q9 =>
        amb(VALS, q10 =>
        amb(VALS, q11 => {
          // Q11: count(B in q[1..10]) = q[11] - 1.
          const q110 = [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10];
          if (q110.filter(v => v === B).length !== q11 - 1) return fail();
          return amb(VALS, q12 =>
          amb(VALS, q13 =>
          amb(VALS, q14 => {
            // Q9: next match for q[9] at q[9] + 9 ∈ {10..14}.
            const qa = [null, q1, q2, q3, q4, q5, q6, q7, q8, q9,
                        q10, q11, q12, q13, q14];
            const t9 = q9 + 9;
            if (qa[t9] !== q9) return fail();
            if (qa.slice(10, t9).includes(q9)) return fail();
            return amb(VALS, q15 => {
              // Q15: q[12] = q[15].
              if (q12 !== q15) return fail();
              return amb(VALS, q16 => {
                // Q10: q[16] = [D,A,E,B,C][q[10]-1].
                if (q16 !== [D, A, E, B, C][q10 - 1]) return fail();
                // Q16: q[10] = [D,C,B,A,E][q[16]-1].
                if (q10 !== [D, C, B, A, E][q16 - 1]) return fail();
                return amb(VALS, q17 => {
                  // Q6: q[17] determined by q[6]; E impossible.
                  if (q6 === E) return fail();
                  if (q6 === A && q17 !== C) return fail();
                  if (q6 === B && q17 !== D) return fail();
                  if (q6 === C && q17 !== E) return fail();
                  if (q6 === D && [C, D, E].includes(q17)) return fail();
                  // Q17: same shape, q[6] determined by q[17].
                  if (q17 === E) return fail();
                  if (q17 === A && q6 !== C) return fail();
                  if (q17 === B && q6 !== D) return fail();
                  if (q17 === C && q6 !== E) return fail();
                  if (q17 === D && [C, D, E].includes(q6)) return fail();
                  return amb(VALS, q18 =>
                  amb(VALS, q19 => {
                    // Q13: unique odd-A at 2*q[13]+7 ∈ {9,11,13,15,17}.
                    const qb = [null, q1, q2, q3, q4, q5, q6, q7, q8, q9,
                                q10, q11, q12, q13, q14, q15, q16, q17,
                                q18, q19];
                    const t13 = 2 * q13 + 7;
                    if (qb[t13] !== A) return fail();
                    if ([1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
                        .some(i => i !== t13 && qb[i] === A)) return fail();
                    return amb(VALS, q20 => {
                      const qf = [null, q1, q2, q3, q4, q5, q6, q7, q8, q9,
                                  q10, q11, q12, q13, q14, q15, q16, q17,
                                  q18, q19, q20];
                      const count = pred =>
                        qf.slice(1).filter(pred).length;

                      // Q2: only consecutive equal pair.
                      const [pa, pb] =
                        [[6,7],[7,8],[8,9],[9,10],[10,11]][q2 - 1];
                      if (qf[pa] !== qf[pb]) return fail();
                      for (let i = 1; i < 20; i++) {
                        if (i !== pa && qf[i] === qf[i + 1]) return fail();
                      }
                      // Q3: count(E) = q[3] - 1.
                      if (count(v => v === E) !== q3 - 1) return fail();
                      // Q4: count(A) = q[4] + 3.
                      const ca = count(v => v === A);
                      if (ca !== q4 + 3) return fail();
                      // Q8: count(vowels) = q[8] + 3.
                      if (count(v => v === A || v === E) !== q8 + 3)
                        return fail();
                      // Q12: consonant count even/odd/sq/prime/×5.
                      const cc = count(v => v === B || v === C || v === D);
                      const ok12 = q12 === A ? cc % 2 === 0
                                 : q12 === B ? cc % 2 === 1
                                 : q12 === C ? SQUARES.has(cc)
                                 : q12 === D ? PRIMES.has(cc)
                                 :             cc % 5 === 0;
                      if (!ok12) return fail();
                      // Q14: count(D) = q[14] + 5.
                      if (count(v => v === D) !== q14 + 5) return fail();
                      // Q18: count(A) = count(letter[q[18]+1]); E = none.
                      if (q18 === E) {
                        if ([B,C,D,E].some(v => count(x => x === v) === ca))
                          return fail();
                      } else if (count(v => v === q18 + 1) !== ca)
                        return fail();
                      // Q19, Q20: tautologies.
                      return qf;
                    });
                  }));
                });
              });
            });
          })));
        })));
      })));
    }))))),
};

export default puzzle;
import.meta.main && report(puzzle);
