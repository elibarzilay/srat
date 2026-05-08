"""McCarthy's ambiguous operator, throw-and-replay implementation.

`amb_run(func)` calls `func(amb, fail)`:
  amb(a, b, c)  non-deterministically picks one such that the
                rest of the computation succeeds.
  amb()         no arguments — synonym for fail().
  fail()        rejects the current path; the driver backtracks.
Returns whatever func returns on the first successful path, or
None if the choice tree is exhausted.

Each backtrack re-runs func from the top, replaying the chosen
indices recorded so far, so func must be pure of externally-
visible side effects.
"""


class _Fail(Exception):
    pass


def amb_run(func):
    choices = []
    index = 0

    def amb(*values):
        nonlocal index
        if not values:
            raise _Fail
        if index == len(choices):
            choices.append({"i": 0, "count": len(values)})
        choice = choices[index]
        index += 1
        return values[choice["i"]]

    def fail():
        raise _Fail

    while True:
        try:
            index = 0
            return func(amb, fail)
        except _Fail:
            choice = None
            while choices:
                c = choices.pop()
                c["i"] += 1
                if c["i"] != c["count"]:
                    choice = c
                    break
            if choice is None:
                return None
            choices.append(choice)
