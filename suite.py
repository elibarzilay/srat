"""Run every puzzle a fixed number of times. Reps are deliberately
constant across languages so the JS and Python suites can be
compared directly; counts are calibrated for JavaScript timings.
"""

import time

from solver import solve, fmt
from srt_1 import puzzle as srt1
from srt_2 import puzzle as srt2
from srq_1 import puzzle as srq1
from srq_2 import puzzle as srq2
from srat_henz import puzzle as srat_henz
from srat import puzzle as srat

for p, reps in [
    (srt1,        17000),
    (srt2,          200),
    (srq1,          500),
    (srq2,           40),
    (srat_henz,     130),
    (srat,            1),
]:
    t0 = time.perf_counter()
    sols = solve(p)
    total_ms = (time.perf_counter() - t0) * 1000
    for _ in range(1, reps):
        ti = time.perf_counter()
        solve(p)
        total_ms += (time.perf_counter() - ti) * 1000
    sec = f"{total_ms / 1000:.1f}"
    print(f"{p['name']}: {len(sols)} sol(s), {sec}s ({reps} reps)")
    for s in sols:
        print("  " + fmt(s))
