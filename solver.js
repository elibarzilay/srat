// amb-driven solver. Each puzzle is `{ name, run: (amb, fail) => q }`;
// the run function uses amb/fail to non-deterministically build the
// answer vector q. solve enumerates all solutions; report times and
// prints them.

import { ambRun } from "./amb";

export const solve = ({ run }) => {
  const sols = [];
  ambRun((amb, fail) => {
    sols.push(run(amb, fail));
    fail();
  });
  return sols;
};

export const fmt = s => s.slice(1).map(v => "ABCDE"[v - 1]).join(" ");

export const report = puzzle => {
  const t0 = performance.now();
  const sols = solve(puzzle);
  const sec = ((performance.now() - t0) / 1000).toFixed(1);
  console.log(`${puzzle.name}: ${sols.length} sol(s), ${sec}s`);
  for (const s of sols) console.log("  " + fmt(s));
};
