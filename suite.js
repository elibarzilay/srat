// Run every puzzle, repeating each enough times that the total time
// is roughly the same — anchored to ~10s so SRAT (which already takes
// ~9s) runs once. The loop adds reps until one more would overshoot
// the target, using the running average as the per-rep estimate.

import { solve, fmt } from "./solver";
import srt1 from "./srt-1";
import srt2 from "./srt-2";
import srq1 from "./srq-1";
import srq2 from "./srq-2";
import sratHenz from "./srat-henz";
import srat from "./srat";

const TARGET_MS = 10000;

for (const p of [srt1, srt2, srq1, srq2, sratHenz, srat]) {
  const t0 = performance.now();
  const sols = solve(p);
  let total = performance.now() - t0;
  let reps = 1;
  while (total + total / reps <= TARGET_MS) {
    const ti = performance.now();
    solve(p);
    total += performance.now() - ti;
    reps++;
  }
  const sec = (total / 1000).toFixed(1);
  console.log(`${p.name}: ${sols.length} sol(s), ${sec}s (${reps} reps)`);
  for (const s of sols) console.log("  " + fmt(s));
}
