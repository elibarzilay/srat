"""amb-driven solver. Each puzzle is `{"name": ..., "run": (amb, fail) ->
result}` where run is a CPS expression that returns each answer vector
or `fail()` for invalid ones. solve enumerates every solution; report
times and prints them.
"""

import time

from amb import amb_all


def solve(puzzle):
    return amb_all(puzzle["run"])


def fmt(s):
    return " ".join("ABCDE"[v - 1] for v in s[1:])


def report(puzzle):
    t0 = time.perf_counter()
    sols = solve(puzzle)
    sec = f"{time.perf_counter() - t0:.1f}"
    print(f"{puzzle['name']}: {len(sols)} sol(s), {sec}s")
    for s in sols:
        print("  " + fmt(s))
