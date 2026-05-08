"""Patrick Honner's Simple Self-Referential Test II (10Q × 5).
http://mrhonner.com/archives/8106
"""

from solver import report

A, B, C, D, E = 1, 2, 3, 4, 5
PRIMES = {2, 3, 5, 7}
SQUARES = {0, 1, 4, 9}


def run(amb, fail):
    pick = lambda: amb(A, B, C, D, E)
    q = [None]

    for _ in range(5):
        q.append(pick())

    q.append(pick())  # q[6]
    # Q4: q[6] = q[4].
    if q[6] != q[4]: fail()

    q.append(pick())  # q[7]
    # Q5: q[5] = q[q[5]+2]; q[5]+2 in {3..7}, all bound.
    if q[5] != q[q[5] + 2]: fail()
    # Q6: first B at q[6]+2; q[6]+2 in {3..7}.
    t6 = q[6] + 2
    if q[t6] != B: fail()
    if any(q[i] == B for i in range(1, t6)): fail()

    q.append(pick())  # q[8]
    q.append(pick())  # q[9]
    # Q8: |q[8] - q[9]| = 5 - q[8].
    if abs(q[8] - q[9]) != 5 - q[8]: fail()

    q.append(pick())  # q[10]

    def count(pred): return sum(1 for v in q[1:] if pred(v))

    # Q3: q[10] = 6 - q[3].
    if q[10] != 6 - q[3]: fail()
    # Q10: q[3] = [C,D,A,B,E][q[10]-1].
    if q[3] != [C, D, A, B, E][q[10] - 1]: fail()
    # Q7: count(C) = q[7] - 1.
    if count(lambda v: v == C) != q[7] - 1: fail()
    # Q2: count(A) = count(letter[q[2]+1]); E means all four match.
    ca = count(lambda v: v == A)
    if q[2] == E:
        for v in (B, C, D, E):
            if count(lambda x, v=v: x == v) != ca: fail()
    elif count(lambda v, t=q[2] + 1: v == t) != ca: fail()
    # Q9: vowel count is even/odd/prime/square/×5.
    cv = count(lambda v: v == A or v == E)
    ok9 = (cv % 2 == 0 if q[9] == A
           else cv % 2 == 1 if q[9] == B
           else cv in PRIMES if q[9] == C
           else cv in SQUARES if q[9] == D
           else cv % 5 == 0)
    if not ok9: fail()
    # Q1: tautology.

    return q


puzzle = {"name": "SRT-2 (Honner, 10Q × 5)", "run": run}

if __name__ == "__main__":
    report(puzzle)
