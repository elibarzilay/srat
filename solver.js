// Backtracking constraint solver. Variables are 1-indexed; q[0] is unused.
// Each check returns true / false / "maybe" so partial states can prune early.
// While a variable is unassigned, ok skips its check, so a predicate body
// can read its own answer without a guard.

export const countWith = (q, pred) => {
  let n = 0, unk = 0;
  for (let i = 1; i < q.length; i++) {
    if (q[i] === 0) unk++;
    else if (pred(q[i])) n++;
  }
  return [n, unk];
};

export const inRange = (n, unk, target) =>
  n > target || n + unk < target ? false : unk === 0 ? true : "maybe";

export const solve = ({ N, K, checks }) => {
  const q = new Array(N + 1).fill(0);
  const solutions = [];
  let nodes = 0;
  const ok = () => {
    for (let i = 1; i <= N; i++) {
      if (q[i] === 0) continue;
      if (checks[i](q) === false) return false;
    }
    return true;
  };
  const recurse = idx => {
    nodes++;
    if (idx > N) { solutions.push(q.slice()); return; }
    for (let v = 1; v <= K; v++) {
      q[idx] = v;
      if (ok()) recurse(idx + 1);
    }
    q[idx] = 0;
  };
  recurse(1);
  return { solutions, nodes };
};

const LETTERS = "ABCDEFGHIJ";
const fmt = (q, K) => q.slice(1).map(v => LETTERS[v - 1]).join(" ");

export const run = puzzle => {
  const t0 = performance.now();
  const { solutions, nodes } = solve(puzzle);
  const ms = (performance.now() - t0).toFixed(1);
  console.log(`${puzzle.name}: ${solutions.length} sol(s), ${nodes} nodes, ${ms}ms`);
  for (const s of solutions) console.log("  " + fmt(s, puzzle.K));
};
