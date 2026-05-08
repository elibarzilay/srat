"""Patrick Honner's Simple Self-Referential Test (5Q × 4).
http://mrhonner.com/archives/8106
"""

from solver import report

A, B, C, D = 1, 2, 3, 4


def run(amb, fail):
    q = [None]
    for _ in range(5):
        q.append(amb(A, B, C, D))

    # Q1: q[1] is the letter that appears in no other question.
    if any(q[i] == q[1] for i in range(2, 6)): fail()

    # Q2: q[2]'s sole twin sits at target.
    t2 = [5, 1, 3, 4][q[2] - 1]
    if q[t2] != q[2]: fail()
    if any(q[i] == q[2] for i in range(1, 6) if i != 2 and i != t2): fail()

    # Q3: q[5] = [B,D,A,C][q[3]-1].
    if q[5] != [B, D, A, C][q[3] - 1]: fail()

    # Q4: first A at q[4]+1.
    t4 = q[4] + 1
    if q[t4] != A: fail()
    if any(q[i] == A for i in range(1, t4)): fail()

    # Q5: q[3] = [C,B,D,A][q[5]-1].
    if q[3] != [C, B, D, A][q[5] - 1]: fail()

    return q


puzzle = {"name": "SRT-1 (Honner, 5Q × 4)", "run": run}

if __name__ == "__main__":
    report(puzzle)
