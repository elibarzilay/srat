"""amb-driven solver. Each puzzle is `{"name": ..., "run": (amb, fail) -> q}`;
the run function uses amb/fail to non-deterministically build the
answer vector q. solve enumerates all solutions; report times and
prints them.
"""

import time

from amb import amb_run


def solve(puzzle):
    sols = []

    def collect(amb, fail):
        sols.append(puzzle["run"](amb, fail))
        fail()

    amb_run(collect)
    return sols


def fmt(s):
    return " ".join("ABCDE"[v - 1] for v in s[1:])


def report(puzzle):
    t0 = time.perf_counter()
    sols = solve(puzzle)
    sec = f"{time.perf_counter() - t0:.1f}"
    print(f"{puzzle['name']}: {len(sols)} sol(s), {sec}s")
    for s in sols:
        print("  " + fmt(s))
