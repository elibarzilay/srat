// Ambiguous operator via CPS, in the style of SICP §4.3.
//
// `amb(choices, k)` non-deterministically picks an element of `choices`
// and continues with `k(choice)`. If `k` returns `FAIL`, amb tries the
// next choice; otherwise it returns whatever `k` returned. `fail()`
// returns `FAIL`.
//
// Because each `k` is invoked per choice as a separate call, side
// effects between two amb calls fire exactly once per outer choice —
// no replay.
//
// `ambRun(func)` calls `func(amb, fail)` and returns the first
// successful result, or `undefined` if exhausted.
// `ambAll(func)` calls `func(amb, fail)` with an amb that collects
// every successful result instead of returning the first; returns an
// array.

export const FAIL = Symbol("FAIL");

const _amb = (choices, k) => {
  for (const c of choices) {
    const r = k(c);
    if (r !== FAIL) return r;
  }
  return FAIL;
};

const _fail = () => FAIL;

export const ambRun = func => {
  const r = func(_amb, _fail);
  return r === FAIL ? undefined : r;
};

export const ambAll = func => {
  const sols = [];
  const amb = (choices, k) => {
    for (const c of choices) {
      const r = k(c);
      if (r !== FAIL) sols.push(r);
    }
    return FAIL;
  };
  func(amb, _fail);
  return sols;
};
