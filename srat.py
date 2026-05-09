"""Self-Referential Aptitude Test (Jim Propp, 1993). 20Q × 5.
https://faculty.uml.edu/jpropp/srat.html
"""

from solver import report

A, B, C, D, E = 1, 2, 3, 4, 5
PRIMES = {2, 3, 5, 7, 11, 13, 17, 19}
SQUARES = {0, 1, 4, 9, 16}
VALS = [A, B, C, D, E]


def run(amb, fail):
    def at_5(q1, q2, q3, q4, q5):
        q = [None, q1, q2, q3, q4, q5]
        # Q1: first B at q[1].
        if q[q1] != B: return fail()
        if B in q[1:q1]: return fail()
        # Q5: q[5] = q[q[5]]; trivial when q[5] = E.
        if q5 != E and q[q5] != q5: return fail()
        return amb(VALS, lambda q6:
            amb(VALS, lambda q7:
                amb(VALS, lambda q8:
                    at_8(q1, q2, q3, q4, q5, q6, q7, q8))))

    def at_8(q1, q2, q3, q4, q5, q6, q7, q8):
        # Q7: |q[7] - q[8]| = 5 - q[7].
        if abs(q7 - q8) != 5 - q7: return fail()
        return amb(VALS, lambda q9:
            amb(VALS, lambda q10:
                amb(VALS, lambda q11:
                    at_11(q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11))))

    def at_11(q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11):
        # Q11: count(B in q[1..10]) = q[11] - 1.
        if [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10].count(B) != q11 - 1:
            return fail()
        return amb(VALS, lambda q12:
            amb(VALS, lambda q13:
                amb(VALS, lambda q14: at_14(
                    q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11,
                    q12, q13, q14))))

    def at_14(q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14):
        q = [None, q1, q2, q3, q4, q5, q6, q7, q8, q9,
             q10, q11, q12, q13, q14]
        # Q9: next match for q[9] at q[9] + 9 ∈ {10..14}.
        t9 = q9 + 9
        if q[t9] != q9: return fail()
        if q9 in q[10:t9]: return fail()
        return amb(VALS, lambda q15: at_15(
            q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11,
            q12, q13, q14, q15))

    def at_15(q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13,
              q14, q15):
        # Q15: q[12] = q[15].
        if q12 != q15: return fail()
        return amb(VALS, lambda q16: at_16(
            q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11,
            q12, q13, q14, q15, q16))

    def at_16(q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13,
              q14, q15, q16):
        # Q10: q[16] = [D,A,E,B,C][q[10]-1].
        if q16 != [D, A, E, B, C][q10 - 1]: return fail()
        # Q16: q[10] = [D,C,B,A,E][q[16]-1].
        if q10 != [D, C, B, A, E][q16 - 1]: return fail()
        return amb(VALS, lambda q17: at_17(
            q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11,
            q12, q13, q14, q15, q16, q17))

    def at_17(q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13,
              q14, q15, q16, q17):
        # Q6: q[17] determined by q[6]; E impossible.
        if q6 == E: return fail()
        if q6 == A and q17 != C: return fail()
        if q6 == B and q17 != D: return fail()
        if q6 == C and q17 != E: return fail()
        if q6 == D and q17 in (C, D, E): return fail()
        # Q17: same shape, q[6] determined by q[17].
        if q17 == E: return fail()
        if q17 == A and q6 != C: return fail()
        if q17 == B and q6 != D: return fail()
        if q17 == C and q6 != E: return fail()
        if q17 == D and q6 in (C, D, E): return fail()
        return amb(VALS, lambda q18:
            amb(VALS, lambda q19: at_19(
                q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11,
                q12, q13, q14, q15, q16, q17, q18, q19)))

    def at_19(q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13,
              q14, q15, q16, q17, q18, q19):
        q = [None, q1, q2, q3, q4, q5, q6, q7, q8, q9,
             q10, q11, q12, q13, q14, q15, q16, q17, q18, q19]
        # Q13: unique odd-A at 2*q[13]+7 ∈ {9,11,13,15,17}.
        t13 = 2 * q13 + 7
        if q[t13] != A: return fail()
        if any(q[i] == A for i in (1,3,5,7,9,11,13,15,17,19) if i != t13):
            return fail()
        return amb(VALS, lambda q20: at_20(
            q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11,
            q12, q13, q14, q15, q16, q17, q18, q19, q20))

    def at_20(q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13,
              q14, q15, q16, q17, q18, q19, q20):
        q = [None, q1, q2, q3, q4, q5, q6, q7, q8, q9,
             q10, q11, q12, q13, q14, q15, q16, q17, q18, q19, q20]
        count = lambda pred: sum(1 for v in q[1:] if pred(v))
        # Q2: only consecutive equal pair at pairs[q[2]-1].
        pa, pb = [(6,7),(7,8),(8,9),(9,10),(10,11)][q2 - 1]
        if q[pa] != q[pb]: return fail()
        if any(q[i] == q[i + 1] for i in range(1, 20) if i != pa):
            return fail()
        # Q3: count(E) = q[3] - 1.
        if count(lambda v: v == E) != q3 - 1: return fail()
        # Q4: count(A) = q[4] + 3.
        ca = count(lambda v: v == A)
        if ca != q4 + 3: return fail()
        # Q8: count(vowels) = q[8] + 3.
        if count(lambda v: v == A or v == E) != q8 + 3: return fail()
        # Q12: consonant count is even/odd/square/prime/×5.
        cc = count(lambda v: v in (B, C, D))
        ok12 = (cc % 2 == 0 if q12 == A
                else cc % 2 == 1 if q12 == B
                else cc in SQUARES if q12 == C
                else cc in PRIMES if q12 == D
                else cc % 5 == 0)
        if not ok12: return fail()
        # Q14: count(D) = q[14] + 5.
        if count(lambda v: v == D) != q14 + 5: return fail()
        # Q18: count(A) = count(letter[q[18]+1]); E = none match.
        if q18 == E:
            if any(count(lambda x, v=v: x == v) == ca for v in (B,C,D,E)):
                return fail()
        elif count(lambda v, t=q18 + 1: v == t) != ca:
            return fail()
        # Q19, Q20: tautologies.
        return q

    return amb(VALS, lambda q1:
        amb(VALS, lambda q2:
        amb(VALS, lambda q3:
        amb(VALS, lambda q4:
        amb(VALS, lambda q5: at_5(q1, q2, q3, q4, q5))))))


puzzle = {"name": "SRAT (Propp, 20Q × 5)", "run": run}

if __name__ == "__main__":
    report(puzzle)
