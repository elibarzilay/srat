"""Self-Referential Quiz 2 (10Q × 5).
https://www.brainzilla.com/logic/self-referential-quiz/srq-2/
"""

from solver import report

A, B, C, D, E = 1, 2, 3, 4, 5
VALS = [A, B, C, D, E]


def run(amb, fail):
    def at_8(q1, q2, q3, q4, q5, q6, q7, q8):
        q = [None, q1, q2, q3, q4, q5, q6, q7, q8]
        # Q1: first D at 9 - q[1].
        t1 = 9 - q1
        if q[t1] != D: return fail()
        if D in q[1:t1]: return fail()
        # Q2: q[a] = q[a+1] for chosen pair (no "only" claim).
        pa, pb = [(3,4),(4,5),(5,6),(6,7),(7,8)][q2 - 1]
        if q[pa] != q[pb]: return fail()
        # Q7: |q[7] - q[8]| = 5 - q[7].
        if abs(q7 - q8) != 5 - q7: return fail()
        # Q8: q[8] = q[q[8]]; q[8] ∈ {1..5}, q[1..5] all bound.
        if q8 != q[q8]: return fail()
        return amb(VALS, lambda q9:
            amb(VALS, lambda q10:
                at_10(q1, q2, q3, q4, q5, q6, q7, q8, q9, q10)))

    def at_10(q1, q2, q3, q4, q5, q6, q7, q8, q9, q10):
        q = [None, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10]
        count = lambda pred: sum(1 for v in q[1:] if pred(v))
        # Q3: count(E) = q[3].
        if count(lambda v: v == E) != q3: return fail()
        # Q4: count(A) = q[4].
        ca = count(lambda v: v == A)
        if ca != q4: return fail()
        # Q5: count(A) = count(letter[q[5]]).
        if count(lambda v, t=q5: v == t) != ca: return fail()
        # Q6: last B at q[6] + 4.
        t6 = q6 + 4
        if q[t6] != B: return fail()
        if B in q[t6 + 1:11]: return fail()
        # Q9: count(consonants) = q[9] + 2.
        if count(lambda v: v in (B, C, D)) != q9 + 2: return fail()
        # Q10: tautology.
        return q

    return amb(VALS, lambda q1:
        amb(VALS, lambda q2:
        amb(VALS, lambda q3:
        amb(VALS, lambda q4:
        amb(VALS, lambda q5:
        amb(VALS, lambda q6:
        amb(VALS, lambda q7:
        amb(VALS, lambda q8:
            at_8(q1, q2, q3, q4, q5, q6, q7, q8)))))))))


puzzle = {"name": "SRQ-2 (Brainzilla, 10Q × 5)", "run": run}

if __name__ == "__main__":
    report(puzzle)
