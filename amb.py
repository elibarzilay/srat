"""Ambiguous operator via CPS, in the style of SICP §4.3.

`amb(choices, k)` non-deterministically picks an element of `choices`
and continues with `k(choice)`. If `k` returns `FAIL`, amb tries the
next choice; otherwise it returns whatever `k` returned. `fail()`
returns `FAIL`.

Side effects between two amb calls fire exactly once per outer
choice — no replay.

`amb_run(func)` calls `func(amb, fail)` and returns the first
successful result, or `None` if exhausted.
`amb_all(func)` calls `func(amb, fail)` with an amb that collects
every successful result; returns a list.
"""

FAIL = object()


def _amb(choices, k):
    for c in choices:
        r = k(c)
        if r is not FAIL:
            return r
    return FAIL


def _fail():
    return FAIL


def amb_run(func):
    r = func(_amb, _fail)
    return None if r is FAIL else r


def amb_all(func):
    sols = []

    def amb(choices, k):
        for c in choices:
            r = k(c)
            if r is not FAIL:
                sols.append(r)
        return FAIL

    func(amb, _fail)
    return sols
