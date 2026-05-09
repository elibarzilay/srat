"""Self-Referential Aptitude Test from Henz 1996, used as a worked example
in the Mozart/Oz documentation (10Q × 5).
https://mozart.github.io/mozart-v1/doc-1.4.0/fdt/node38.html
"""

from solver import report

A, B, C, D, E = 1, 2, 3, 4, 5
PRIMES = {2, 3, 5, 7}
SQUARES = {0, 1, 4, 9}
CUBES = {0, 1, 8}
FACTORIALS = {1, 2, 6}
VALS = [A, B, C, D, E]


def run(amb, fail):
    def at_6(q1, q2, q3, q4, q5, q6):
        q = [None, q1, q2, q3, q4, q5, q6]
        # Q1: first B at q[1] + 1.
        t1 = q1 + 1
        if q[t1] != B: return fail()
        if B in q[1:t1]: return fail()
        return amb(VALS, lambda q7: at_7(q1, q2, q3, q4, q5, q6, q7))

    def at_7(q1, q2, q3, q4, q5, q6, q7):
        q = [None, q1, q2, q3, q4, q5, q6, q7]
        # Q3: q[3] = q[t3]; t3 = [1,2,4,7,6][q[3]-1].
        t3 = [1, 2, 4, 7, 6][q3 - 1]
        if q[t3] != q3: return fail()
        return amb(VALS, lambda q8: at_8(q1, q2, q3, q4, q5, q6, q7, q8))

    def at_8(q1, q2, q3, q4, q5, q6, q7, q8):
        # Q7: |q[7]-q[8]| = 5 - q[7].
        if abs(q7 - q8) != 5 - q7: return fail()
        return amb(VALS, lambda q9:
            amb(VALS, lambda q10:
                at_10(q1, q2, q3, q4, q5, q6, q7, q8, q9, q10)))

    def at_10(q1, q2, q3, q4, q5, q6, q7, q8, q9, q10):
        q = [None, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10]
        count = lambda pred: sum(1 for v in q[1:] if pred(v))
        # Q2: only consecutive equal pair at pairs[q[2]-1].
        pa, pb = [(2,3),(3,4),(4,5),(5,6),(6,7)][q2 - 1]
        if q[pa] != q[pb]: return fail()
        if any(q[i] == q[i + 1] for i in range(1, 10) if i != pa):
            return fail()
        # Q4: count(A) = q[4] - 1.
        ca = count(lambda v: v == A)
        if ca != q4 - 1: return fail()
        # Q5: q[5] = q[11 - q[5]].
        if q5 != q[11 - q5]: return fail()
        # Q6: count(A) = count(letter[q[6]+1]); E means none match.
        if q6 == E:
            if any(count(lambda x, v=v: x == v) == ca for v in (B,C,D,E)):
                return fail()
        elif count(lambda v, t=q6 + 1: v == t) != ca:
            return fail()
        # Q8: count(vowels) = q[8] + 1.
        if count(lambda v: v == A or v == E) != q8 + 1: return fail()
        # Q9: consonant count is prime/factorial/square/cube/÷5.
        cc = count(lambda v: v in (B, C, D))
        ok9 = (cc in PRIMES if q9 == A
               else cc in FACTORIALS if q9 == B
               else cc in SQUARES if q9 == C
               else cc in CUBES if q9 == D
               else cc % 5 == 0)
        if not ok9: return fail()
        # Q10: tautology.
        return q

    return amb(VALS, lambda q1:
        amb(VALS, lambda q2:
        amb(VALS, lambda q3:
        amb(VALS, lambda q4:
        amb(VALS, lambda q5:
        amb(VALS, lambda q6: at_6(q1, q2, q3, q4, q5, q6)))))))


puzzle = {"name": "SRAT (Henz, 10Q × 5)", "run": run}

if __name__ == "__main__":
    report(puzzle)
