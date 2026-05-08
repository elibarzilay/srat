"""Self-Referential Quiz 1 by Maja Bubalo & Mirko Cubrilo (10Q × 5).
https://www.brainzilla.com/logic/self-referential-quiz/srq-1/
"""

from solver import report

A, B, C, D, E = 1, 2, 3, 4, 5
PRIMES = {2, 3, 5, 7}
SQUARES = {0, 1, 4, 9}
CUBES = {0, 1, 8}
FACTORIALS = {1, 2, 6}


def run(amb, fail):
    pick = lambda: amb(A, B, C, D, E)
    q = [None]

    for _ in range(5):
        q.append(pick())

    # Q1: first E at q[1].
    if q[q[1]] != E: fail()
    if any(q[i] == E for i in range(1, q[1])): fail()

    q.append(pick())  # q[6]
    q.append(pick())  # q[7]
    # Q7: q[7] = q[q[7]].
    if q[7] != q[q[7]]: fail()

    q.append(pick())  # q[8]
    q.append(pick())  # q[9]
    # Q8: |q[8] - q[9]| = 5 - q[8].
    if abs(q[8] - q[9]) != 5 - q[8]: fail()
    # Q2: only odd-indexed B at target = [9,7,5,3,1][q[2]-1].
    t2 = [9, 7, 5, 3, 1][q[2] - 1]
    if q[t2] != B: fail()
    if any(q[i] == B for i in range(1, 10, 2) if i != t2): fail()
    # Q6: last odd-indexed match for q[6] at target = 2*q[6]-1.
    t6 = 2 * q[6] - 1
    if q[t6] != q[6]: fail()
    if any(q[i] == q[6] for i in range(t6 + 2, 10, 2)): fail()

    q.append(pick())  # q[10]

    def count(pred): return sum(1 for v in q[1:] if pred(v))

    # Q3: only consecutive equal pair at pairs[q[3]-1].
    pairs = [(2, 3), (3, 4), (4, 5), (5, 6), (6, 7)]
    pa, pb = pairs[q[3] - 1]
    if q[pa] != q[pb]: fail()
    if any(q[i] == q[i + 1] for i in range(1, 10) if i != pa): fail()
    # Q4: only even-indexed A at target = 2*q[4].
    t4 = 2 * q[4]
    if q[t4] != A: fail()
    if any(q[i] == A for i in range(2, 11, 2) if i != t4): fail()
    # Q5: count(B) = 6 - q[5].
    if count(lambda v: v == B) != 6 - q[5]: fail()
    # Q9: consonant count is prime/square/cube/÷5/factorial.
    cc = count(lambda v: v in (B, C, D))
    ok9 = (cc in PRIMES if q[9] == A
           else cc in SQUARES if q[9] == B
           else cc in CUBES if q[9] == C
           else cc % 5 == 0 if q[9] == D
           else cc in FACTORIALS)
    if not ok9: fail()
    # Q10: tautology.

    return q


puzzle = {"name": "SRQ-1 (Bubalo/Cubrilo, 10Q × 5)", "run": run}

if __name__ == "__main__":
    report(puzzle)
