// amb-driven solver. Each puzzle is `{ name, run }` where `run(amb,
// fail)` is a CPS expression that returns each answer vector or
// `fail()` for invalid ones. solve enumerates every solution; report
// times and prints them.

import { ambAll } from "./amb";

export const solve = ({ run }) => ambAll(run);

export const fmt = s => s.slice(1).map(v => "ABCDE"[v - 1]).join(" ");

export const report = puzzle => {
  const t0 = performance.now();
  const sols = solve(puzzle);
  const sec = ((performance.now() - t0) / 1000).toFixed(1);
  console.log(`${puzzle.name}: ${sols.length} sol(s), ${sec}s`);
  for (const s of sols) console.log("  " + fmt(s));
};
