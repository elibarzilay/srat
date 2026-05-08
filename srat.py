"""Self-Referential Aptitude Test (Jim Propp, 1993). 20Q × 5.
https://faculty.uml.edu/jpropp/srat.html
"""

from solver import report

A, B, C, D, E = 1, 2, 3, 4, 5
PRIMES = {2, 3, 5, 7, 11, 13, 17, 19}
SQUARES = {0, 1, 4, 9, 16}


def run(amb, fail):
    pick = lambda: amb(A, B, C, D, E)
    q = [None]

    for _ in range(5):
        q.append(pick())

    # Q1: first B at q[1].
    if q[q[1]] != B: fail()
    if any(q[i] == B for i in range(1, q[1])): fail()
    # Q5: q[5] = q[q[5]]; trivial when q[5] = E.
    if q[5] != E and q[q[5]] != q[5]: fail()

    q.append(pick())  # q[6]
    q.append(pick())  # q[7]
    q.append(pick())  # q[8]
    # Q7: |q[7] - q[8]| = 5 - q[7].
    if abs(q[7] - q[8]) != 5 - q[7]: fail()

    q.append(pick())  # q[9]
    q.append(pick())  # q[10]
    q.append(pick())  # q[11]
    # Q11: count(B in q[1..10]) = q[11] - 1.
    cb = sum(1 for i in range(1, 11) if q[i] == B)
    if cb != q[11] - 1: fail()

    q.append(pick())  # q[12]
    q.append(pick())  # q[13]
    q.append(pick())  # q[14]
    # Q9: next match for q[9] at q[9] + 9 in {10..14}.
    t9 = q[9] + 9
    if q[t9] != q[9]: fail()
    if any(q[i] == q[9] for i in range(10, t9)): fail()

    q.append(pick())  # q[15]
    # Q15: q[12] = q[15].
    if q[12] != q[15]: fail()

    q.append(pick())  # q[16]
    # Q10: q[16] = [D,A,E,B,C][q[10]-1].
    if q[16] != [D, A, E, B, C][q[10] - 1]: fail()
    # Q16: q[10] = [D,C,B,A,E][q[16]-1].
    if q[10] != [D, C, B, A, E][q[16] - 1]: fail()

    q.append(pick())  # q[17]
    # Q6: q[17] determined by q[6]; E impossible.
    if q[6] == E: fail()
    if q[6] == A and q[17] != C: fail()
    if q[6] == B and q[17] != D: fail()
    if q[6] == C and q[17] != E: fail()
    if q[6] == D and q[17] in (C, D, E): fail()
    # Q17: same shape, q[6] determined by q[17].
    if q[17] == E: fail()
    if q[17] == A and q[6] != C: fail()
    if q[17] == B and q[6] != D: fail()
    if q[17] == C and q[6] != E: fail()
    if q[17] == D and q[6] in (C, D, E): fail()

    q.append(pick())  # q[18]
    q.append(pick())  # q[19]
    # Q13: unique odd-A at 2*q[13] + 7 in {9,11,13,15,17}.
    t13 = 2 * q[13] + 7
    if q[t13] != A: fail()
    if any(q[i] == A for i in range(1, 20, 2) if i != t13): fail()

    q.append(pick())  # q[20]

    def count(pred): return sum(1 for v in q[1:] if pred(v))

    # Q2: only consecutive equal pair at pairs[q[2]-1].
    pairs = [(6, 7), (7, 8), (8, 9), (9, 10), (10, 11)]
    pa, pb = pairs[q[2] - 1]
    if q[pa] != q[pb]: fail()
    if any(q[i] == q[i + 1] for i in range(1, 20) if i != pa): fail()
    # Q3: count(E) = q[3] - 1.
    if count(lambda v: v == E) != q[3] - 1: fail()
    # Q4: count(A) = q[4] + 3.
    ca = count(lambda v: v == A)
    if ca != q[4] + 3: fail()
    # Q8: count(vowels) = q[8] + 3.
    if count(lambda v: v == A or v == E) != q[8] + 3: fail()
    # Q12: consonant count is even/odd/square/prime/×5.
    cc = count(lambda v: v in (B, C, D))
    ok12 = (cc % 2 == 0 if q[12] == A
            else cc % 2 == 1 if q[12] == B
            else cc in SQUARES if q[12] == C
            else cc in PRIMES if q[12] == D
            else cc % 5 == 0)
    if not ok12: fail()
    # Q14: count(D) = q[14] + 5.
    if count(lambda v: v == D) != q[14] + 5: fail()
    # Q18: count(A) = count(letter[q[18]+1]); E = none match.
    if q[18] == E:
        for v in (B, C, D, E):
            if count(lambda x, v=v: x == v) == ca: fail()
    elif count(lambda v, t=q[18] + 1: v == t) != ca: fail()
    # Q19, Q20: tautologies.

    return q


puzzle = {"name": "SRAT (Propp, 20Q × 5)", "run": run}

if __name__ == "__main__":
    report(puzzle)
