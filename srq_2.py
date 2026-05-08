"""Self-Referential Quiz 2 (10Q × 5).
https://www.brainzilla.com/logic/self-referential-quiz/srq-2/
"""

from solver import report

A, B, C, D, E = 1, 2, 3, 4, 5


def run(amb, fail):
    pick = lambda: amb(A, B, C, D, E)
    q = [None]

    for _ in range(8):
        q.append(pick())

    # Q1: first D at 9 - q[1].
    t1 = 9 - q[1]
    if q[t1] != D: fail()
    if any(q[i] == D for i in range(1, t1)): fail()

    # Q2: q[a] = q[a+1] for chosen pair (no "only" claim).
    pairs = [(3, 4), (4, 5), (5, 6), (6, 7), (7, 8)]
    pa, pb = pairs[q[2] - 1]
    if q[pa] != q[pb]: fail()

    # Q7: |q[7] - q[8]| = 5 - q[7].
    if abs(q[7] - q[8]) != 5 - q[7]: fail()

    # Q8: q[8] = q[q[8]]; q[8] in {1..5}, q[1..5] all bound.
    if q[8] != q[q[8]]: fail()

    q.append(pick())  # q[9]
    q.append(pick())  # q[10]

    def count(pred): return sum(1 for v in q[1:] if pred(v))

    # Q3: count(E) = q[3].
    if count(lambda v: v == E) != q[3]: fail()
    # Q4: count(A) = q[4].
    ca = count(lambda v: v == A)
    if ca != q[4]: fail()
    # Q5: count(A) = count(letter[q[5]]).
    if count(lambda v, t=q[5]: v == t) != ca: fail()
    # Q6: last B at q[6] + 4.
    t6 = q[6] + 4
    if q[t6] != B: fail()
    if any(q[i] == B for i in range(t6 + 1, 11)): fail()
    # Q9: count(consonants) = q[9] + 2.
    if count(lambda v: v in (B, C, D)) != q[9] + 2: fail()
    # Q10: tautology.

    return q


puzzle = {"name": "SRQ-2 (Brainzilla, 10Q × 5)", "run": run}

if __name__ == "__main__":
    report(puzzle)
