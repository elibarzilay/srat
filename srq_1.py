"""Self-Referential Quiz 1 by Maja Bubalo & Mirko Cubrilo (10Q × 5).
https://www.brainzilla.com/logic/self-referential-quiz/srq-1/
"""

from solver import report

A, B, C, D, E = 1, 2, 3, 4, 5
PRIMES = {2, 3, 5, 7}
SQUARES = {0, 1, 4, 9}
CUBES = {0, 1, 8}
FACTORIALS = {1, 2, 6}
VALS = [A, B, C, D, E]


def run(amb, fail):
    def at_5(q1, q2, q3, q4, q5):
        q = [None, q1, q2, q3, q4, q5]
        # Q1: first E at q[1].
        if q[q1] != E: return fail()
        if E in q[1:q1]: return fail()
        return amb(VALS, lambda q6:
            amb(VALS, lambda q7: at_7(q1, q2, q3, q4, q5, q6, q7)))

    def at_7(q1, q2, q3, q4, q5, q6, q7):
        q = [None, q1, q2, q3, q4, q5, q6, q7]
        # Q7: q[7] = q[q[7]].
        if q7 != q[q7]: return fail()
        return amb(VALS, lambda q8:
            amb(VALS, lambda q9:
                at_9(q1, q2, q3, q4, q5, q6, q7, q8, q9)))

    def at_9(q1, q2, q3, q4, q5, q6, q7, q8, q9):
        q = [None, q1, q2, q3, q4, q5, q6, q7, q8, q9]
        # Q8: |q[8]-q[9]| = 5 - q[8].
        if abs(q8 - q9) != 5 - q8: return fail()
        # Q2: only odd-indexed B at target = [9,7,5,3,1][q[2]-1].
        t2 = [9, 7, 5, 3, 1][q2 - 1]
        if q[t2] != B: return fail()
        if any(q[i] == B for i in (1, 3, 5, 7, 9) if i != t2): return fail()
        # Q6: last odd-indexed match for q[6] at target = 2*q[6]-1.
        t6 = 2 * q6 - 1
        if q[t6] != q6: return fail()
        if any(q[i] == q6 for i in (1, 3, 5, 7, 9) if i > t6): return fail()
        return amb(VALS, lambda q10:
            at_10(q1, q2, q3, q4, q5, q6, q7, q8, q9, q10))

    def at_10(q1, q2, q3, q4, q5, q6, q7, q8, q9, q10):
        q = [None, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10]
        count = lambda pred: sum(1 for v in q[1:] if pred(v))
        # Q3: only consecutive equal pair at pairs[q[3]-1].
        pa, pb = [(2,3),(3,4),(4,5),(5,6),(6,7)][q3 - 1]
        if q[pa] != q[pb]: return fail()
        if any(q[i] == q[i + 1] for i in range(1, 10) if i != pa):
            return fail()
        # Q4: only even-indexed A at target = 2*q[4].
        t4 = 2 * q4
        if q[t4] != A: return fail()
        if any(q[i] == A for i in (2, 4, 6, 8, 10) if i != t4): return fail()
        # Q5: count(B) = 6 - q[5].
        if count(lambda v: v == B) != 6 - q5: return fail()
        # Q9: consonant count: prime/square/cube/÷5/factorial.
        cc = count(lambda v: v in (B, C, D))
        ok9 = (cc in PRIMES if q9 == A
               else cc in SQUARES if q9 == B
               else cc in CUBES if q9 == C
               else cc % 5 == 0 if q9 == D
               else cc in FACTORIALS)
        if not ok9: return fail()
        # Q10: tautology.
        return q

    return amb(VALS, lambda q1:
        amb(VALS, lambda q2:
        amb(VALS, lambda q3:
        amb(VALS, lambda q4:
        amb(VALS, lambda q5: at_5(q1, q2, q3, q4, q5))))))


puzzle = {"name": "SRQ-1 (Bubalo/Cubrilo, 10Q × 5)", "run": run}

if __name__ == "__main__":
    report(puzzle)
