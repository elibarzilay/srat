"""Patrick Honner's Simple Self-Referential Test (5Q × 4).
http://mrhonner.com/archives/8106
"""

from solver import report

A, B, C, D = 1, 2, 3, 4
VALS = [A, B, C, D]


def run(amb, fail):
    def at_5(q1, q2, q3, q4, q5):
        q = [None, q1, q2, q3, q4, q5]
        # Q1: q[1] is the letter unused in q[2..5].
        if q1 in q[2:]: return fail()
        # Q2: q[2]'s sole twin sits at target.
        t2 = [5, 1, 3, 4][q2 - 1]
        if q[t2] != q2: return fail()
        if any(q[i] == q2 for i in (1, 3, 4, 5) if i != t2): return fail()
        # Q3: q[5] = [B,D,A,C][q[3]-1].
        if q5 != [B, D, A, C][q3 - 1]: return fail()
        # Q4: first A at q[4]+1.
        t4 = q4 + 1
        if q[t4] != A: return fail()
        if A in q[1:t4]: return fail()
        # Q5: q[3] = [C,B,D,A][q[5]-1].
        if q3 != [C, B, D, A][q5 - 1]: return fail()
        return q

    return amb(VALS, lambda q1:
        amb(VALS, lambda q2:
        amb(VALS, lambda q3:
        amb(VALS, lambda q4:
        amb(VALS, lambda q5: at_5(q1, q2, q3, q4, q5))))))


puzzle = {"name": "SRT-1 (Honner, 5Q × 4)", "run": run}

if __name__ == "__main__":
    report(puzzle)
