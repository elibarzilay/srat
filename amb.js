// McCarthy's ambiguous operator, throw-and-replay implementation.
//
// `ambRun(func)` calls `func(amb, fail)`:
//   amb(a, b, c)  non-deterministically picks one such that the
//                 rest of the computation succeeds.
//   amb()         no arguments — synonym for fail().
//   fail()        rejects the current path; the driver backtracks.
// Returns whatever func returns on the first successful path, or
// undefined if the choice tree is exhausted.
//
// Each backtrack re-runs func from the top, replaying the chosen
// indices recorded so far, so func must be pure of externally-
// visible side effects.

export const ambRun = func => {
  const choices = [];
  let index;
  const FAIL = {};
  const amb = (...values) => {
    if (values.length === 0) throw FAIL;
    if (index === choices.length) {
      choices.push({ i: 0, count: values.length });
    }
    return values[choices[index++].i];
  };
  const fail = () => { throw FAIL; };
  while (true) {
    try {
      index = 0;
      return func(amb, fail);
    } catch (e) {
      if (e !== FAIL) throw e;
      let choice;
      while ((choice = choices.pop()) && ++choice.i === choice.count);
      if (!choice) return undefined;
      choices.push(choice);
    }
  }
};
