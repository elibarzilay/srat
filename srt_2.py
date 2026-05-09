"""Patrick Honner's Simple Self-Referential Test II (10Q × 5).
http://mrhonner.com/archives/8106
"""

from solver import report

A, B, C, D, E = 1, 2, 3, 4, 5
PRIMES = {2, 3, 5, 7}
SQUARES = {0, 1, 4, 9}
VALS = [A, B, C, D, E]


def run(amb, fail):
    def at_6(q1, q2, q3, q4, q5, q6):
        # Q4: q[6] = q[4].
        if q6 != q4: return fail()
        return amb(VALS, lambda q7: at_7(q1, q2, q3, q4, q5, q6, q7))

    def at_7(q1, q2, q3, q4, q5, q6, q7):
        q = [None, q1, q2, q3, q4, q5, q6, q7]
        # Q5: q[5] = q[q[5]+2]; q[5]+2 ∈ {3..7}, all bound.
        if q5 != q[q5 + 2]: return fail()
        # Q6: first B at q[6]+2; q[6]+2 ∈ {3..7}.
        t6 = q6 + 2
        if q[t6] != B: return fail()
        if B in q[1:t6]: return fail()
        return amb(VALS, lambda q8:
            amb(VALS, lambda q9: at_9(q1, q2, q3, q4, q5, q6, q7, q8, q9)))

    def at_9(q1, q2, q3, q4, q5, q6, q7, q8, q9):
        # Q8: |q[8] - q[9]| = 5 - q[8].
        if abs(q8 - q9) != 5 - q8: return fail()
        return amb(VALS, lambda q10:
            at_10(q1, q2, q3, q4, q5, q6, q7, q8, q9, q10))

    def at_10(q1, q2, q3, q4, q5, q6, q7, q8, q9, q10):
        q = [None, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10]
        count = lambda pred: sum(1 for v in q[1:] if pred(v))
        # Q3: q[10] = 6 - q[3].
        if q10 != 6 - q3: return fail()
        # Q10: q[3] = [C,D,A,B,E][q[10]-1].
        if q3 != [C, D, A, B, E][q10 - 1]: return fail()
        # Q7: count(C) = q[7] - 1.
        if count(lambda v: v == C) != q7 - 1: return fail()
        # Q2: count(A) = count(letter[q[2]+1]); E means all four match.
        ca = count(lambda v: v == A)
        if q2 == E:
            if any(count(lambda x, v=v: x == v) != ca for v in (B,C,D,E)):
                return fail()
        elif count(lambda v, t=q2 + 1: v == t) != ca:
            return fail()
        # Q9: vowel count is even/odd/prime/square/×5.
        cv = count(lambda v: v == A or v == E)
        ok9 = (cv % 2 == 0 if q9 == A
               else cv % 2 == 1 if q9 == B
               else cv in PRIMES if q9 == C
               else cv in SQUARES if q9 == D
               else cv % 5 == 0)
        if not ok9: return fail()
        # Q1: tautology.
        return q

    return amb(VALS, lambda q1:
        amb(VALS, lambda q2:
        amb(VALS, lambda q3:
        amb(VALS, lambda q4:
        amb(VALS, lambda q5:
        amb(VALS, lambda q6: at_6(q1, q2, q3, q4, q5, q6)))))))


puzzle = {"name": "SRT-2 (Honner, 10Q × 5)", "run": run}

if __name__ == "__main__":
    report(puzzle)
