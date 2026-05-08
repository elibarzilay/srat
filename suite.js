// Run every puzzle a fixed number of times, calibrated so total
// times are roughly comparable in JavaScript. Reps are deliberately
// constant across languages so Python's suite (which has the same
// counts) can be compared directly.

import { solve, fmt } from "./solver";
import srt1 from "./srt-1";
import srt2 from "./srt-2";
import srq1 from "./srq-1";
import srq2 from "./srq-2";
import sratHenz from "./srat-henz";
import srat from "./srat";

for (const [p, reps] of [
  [srt1,     17000],
  [srt2,       200],
  [srq1,       500],
  [srq2,        40],
  [sratHenz,   130],
  [srat,         1],
]) {
  const t0 = performance.now();
  const sols = solve(p);
  let total = performance.now() - t0;
  for (let i = 1; i < reps; i++) {
    const ti = performance.now();
    solve(p);
    total += performance.now() - ti;
  }
  const sec = (total / 1000).toFixed(1);
  console.log(`${p.name}: ${sols.length} sol(s), ${sec}s (${reps} reps)`);
  for (const s of sols) console.log("  " + fmt(s));
}
