"""Run every puzzle, repeating each enough times that the total time
is roughly the same — anchored to ~10s. The loop adds reps until one
more would overshoot the target, using the running average as the
per-rep estimate.

In Python, SRAT itself takes well over 10s (Python's exception
machinery is slower than V8/JSC's), so it overshoots; the smaller
puzzles still fill out to ~10s.
"""

import time

from solver import solve, fmt
from srt_1 import puzzle as srt1
from srt_2 import puzzle as srt2
from srq_1 import puzzle as srq1
from srq_2 import puzzle as srq2
from srat_henz import puzzle as srat_henz
from srat import puzzle as srat

TARGET_MS = 10000

for p in [srt1, srt2, srq1, srq2, srat_henz, srat]:
    t0 = time.perf_counter()
    sols = solve(p)
    total_ms = (time.perf_counter() - t0) * 1000
    reps = 1
    while total_ms + total_ms / reps <= TARGET_MS:
        ti = time.perf_counter()
        solve(p)
        total_ms += (time.perf_counter() - ti) * 1000
        reps += 1
    sec = f"{total_ms / 1000:.1f}"
    print(f"{p['name']}: {len(sols)} sol(s), {sec}s ({reps} reps)")
    for s in sols:
        print("  " + fmt(s))
