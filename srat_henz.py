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


def run(amb, fail):
    pick = lambda: amb(A, B, C, D, E)
    q = [None]

    for _ in range(6):
        q.append(pick())

    # Q1: first B at q[1] + 1.
    t1 = q[1] + 1
    if q[t1] != B: fail()
    if any(q[i] == B for i in range(1, t1)): fail()

    q.append(pick())  # q[7]
    # Q3: q[3] = q[t3]; t3 = [1,2,4,7,6][q[3]-1].
    t3 = [1, 2, 4, 7, 6][q[3] - 1]
    if q[t3] != q[3]: fail()

    q.append(pick())  # q[8]
    # Q7: |q[7] - q[8]| = 5 - q[7].
    if abs(q[7] - q[8]) != 5 - q[7]: fail()

    q.append(pick())  # q[9]
    q.append(pick())  # q[10]

    def count(pred): return sum(1 for v in q[1:] if pred(v))

    # Q2: only consecutive equal pair at pairs[q[2]-1].
    pairs = [(2, 3), (3, 4), (4, 5), (5, 6), (6, 7)]
    pa, pb = pairs[q[2] - 1]
    if q[pa] != q[pb]: fail()
    if any(q[i] == q[i + 1] for i in range(1, 10) if i != pa): fail()
    # Q4: count(A) = q[4] - 1.
    ca = count(lambda v: v == A)
    if ca != q[4] - 1: fail()
    # Q5: q[5] = q[11 - q[5]].
    if q[5] != q[11 - q[5]]: fail()
    # Q6: count(A) = count(letter[q[6]+1]); E means none match.
    if q[6] == E:
        for v in (B, C, D, E):
            if count(lambda x, v=v: x == v) == ca: fail()
    elif count(lambda v, t=q[6] + 1: v == t) != ca: fail()
    # Q8: count(vowels) = q[8] + 1.
    if count(lambda v: v == A or v == E) != q[8] + 1: fail()
    # Q9: consonant count is prime/factorial/square/cube/÷5.
    cc = count(lambda v: v in (B, C, D))
    ok9 = (cc in PRIMES if q[9] == A
           else cc in FACTORIALS if q[9] == B
           else cc in SQUARES if q[9] == C
           else cc in CUBES if q[9] == D
           else cc % 5 == 0)
    if not ok9: fail()
    # Q10: tautology.

    return q


puzzle = {"name": "SRAT (Henz, 10Q × 5)", "run": run}

if __name__ == "__main__":
    report(puzzle)
