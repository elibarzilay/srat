"""Tests for amb. Run with `pytest amb.test.py` or `python amb.test.py`."""

from amb import amb_run


# Examples — illustrate what amb is for and how it reads.

def test_factorization():
    def f(amb, fail):
        x = amb(1, 2, 3)
        y = amb(4, 5, 6)
        if x * y != 8: fail()
        return [x, y]
    assert amb_run(f) == [2, 4]


def test_four_word_chain():
    def f(amb, fail):
        linked = lambda a, b: a[-1] == b[0]
        w1 = amb("the", "that", "a")
        w2 = amb("frog", "elephant", "thing")
        if not linked(w1, w2): fail()
        w3 = amb("walked", "treaded", "grows")
        if not linked(w2, w3): fail()
        w4 = amb("slowly", "quickly")
        if not linked(w3, w4): fail()
        return " ".join([w1, w2, w3, w4])
    assert amb_run(f) == "that thing grows slowly"


def test_pythagorean_in_1_to_6():
    def f(amb, fail):
        int6 = lambda: amb(1, 2, 3, 4, 5, 6)
        a = int6()
        b = int6()
        c = int6()
        if a * a != b * b + c * c: fail()
        return [a, b, c]
    assert amb_run(f) == [5, 3, 4]


# SICP §4.3.2: five people on different floors of a 5-story building.
# Baker not on top; Cooper not on bottom; Fletcher not top or bottom;
# Miller higher than Cooper; Smith not adjacent to Fletcher;
# Fletcher not adjacent to Cooper.
def test_baker_cooper_floors():
    def f(amb, fail):
        distinct = lambda *xs: len(set(xs)) == len(xs)
        adj = lambda a, b: abs(a - b) == 1
        baker = amb(1, 2, 3, 4, 5)
        if baker == 5: fail()
        cooper = amb(1, 2, 3, 4, 5)
        if cooper == 1: fail()
        fletcher = amb(1, 2, 3, 4, 5)
        if fletcher == 1 or fletcher == 5: fail()
        miller = amb(1, 2, 3, 4, 5)
        if miller <= cooper: fail()
        smith = amb(1, 2, 3, 4, 5)
        if not distinct(baker, cooper, fletcher, miller, smith): fail()
        if adj(smith, fletcher): fail()
        if adj(fletcher, cooper): fail()
        return {"baker": baker, "cooper": cooper, "fletcher": fletcher,
                "miller": miller, "smith": smith}
    assert amb_run(f) == {
        "baker": 3, "cooper": 2, "fletcher": 4, "miller": 5, "smith": 1,
    }


# The Scheme original uses lazy amb so `(amb n (recursive-call))`
# doesn't evaluate the recursion until backtracking demands it. Our
# amb is eager (varargs), so the lazy two-arm choice becomes
# `n if amb("here","next") == "here" else recurse(...)` — the Python
# ternary gives the laziness Scheme gets from `call/cc`.
def test_first_7_pythagorean_via_streams():
    def collect(n, func):
        sols = []
        def runner(amb, fail):
            v = func(amb, fail)
            sols.append(v)
            if len(sols) < n: fail()
            return v
        amb_run(runner)
        return sols

    def integers_from(amb, n):
        return n if amb("here", "next") == "here" else integers_from(amb, n + 1)

    def integers_between(amb, fail, n, m):
        if not (n <= m): fail()
        return (n if amb("here", "next") == "here"
                else integers_between(amb, fail, n + 1, m))

    def f(amb, fail):
        a = integers_from(amb, 1)
        b = integers_between(amb, fail, 1, a)
        c = integers_between(amb, fail, 1, a)
        if a * a != b * b + c * c: fail()
        return [a, b, c]

    triples = collect(7, f)
    assert len(triples) == 7
    assert triples[0] == [5, 3, 4]
    for a, b, c in triples:
        assert a * a == b * b + c * c


# Implementation — thorough coverage of the operator's behavior.

def test_no_amb_calls():
    assert amb_run(lambda amb, fail: 42) == 42


def test_amb_no_args_fails():
    assert amb_run(lambda amb, fail: amb()) is None


def test_top_level_fail():
    def f(amb, fail): fail()
    assert amb_run(f) is None


def test_single_amb_first_value_no_constraint():
    assert amb_run(lambda amb, fail: amb(1, 2, 3)) == 1


def test_single_amb_backtracks_to_satisfying_value():
    def f(amb, fail):
        x = amb(1, 2, 3)
        if x != 3: fail()
        return x
    assert amb_run(f) == 3


def test_no_solution_returns_none():
    def f(amb, fail):
        x = amb(1, 2, 3)
        if x > 0: fail()
        return x
    assert amb_run(f) is None


def test_user_exceptions_propagate():
    def f(amb, fail): raise ValueError("oops")
    try:
        amb_run(f)
    except ValueError as e:
        assert "oops" in str(e)
        return
    raise AssertionError("expected ValueError")


def test_leftmost_first_dfs_order():
    # x·y = 8 admits (1,8), (2,4), (4,2), (8,1) within these ranges.
    # Leftmost-first: iterate x outer, y inner; (1,8) wins.
    def f(amb, fail):
        x = amb(1, 2, 3, 4)
        y = amb(1, 2, 3, 4, 5, 6, 7, 8)
        if x * y != 8: fail()
        return [x, y]
    assert amb_run(f) == [1, 8]


def test_conditional_amb_branches_with_different_amb_counts():
    def f(amb, fail):
        tag = amb("short", "long")
        if tag == "short": return tag
        n = amb(1, 2, 3)
        if n != 2: fail()
        return [tag, n]
    assert amb_run(f) == "short"


def test_amb_in_a_loop():
    def f(amb, fail):
        xs = []
        for _ in range(4):
            v = amb(0, 1)
            if v != 1: fail()
            xs.append(v)
        return xs
    assert amb_run(f) == [1, 1, 1, 1]


def test_deep_nesting():
    # 32 leaves; the search must walk the whole tree before
    # reaching the all-ones path.
    def f(amb, fail):
        xs = [amb(0, 1) for _ in range(5)]
        if any(x != 1 for x in xs): fail()
        return xs
    assert amb_run(f) == [1, 1, 1, 1, 1]


def test_func_replays_from_top_on_each_backtrack():
    # Documents the side-effect caveat of the throw-and-replay impl.
    calls = [0]
    def f(amb, fail):
        calls[0] += 1
        x = amb(1, 2, 3)
        if x != 3: fail()
        return x
    amb_run(f)
    assert calls[0] == 3


if __name__ == "__main__":
    tests = [(n, f) for n, f in list(globals().items())
             if n.startswith("test_") and callable(f)]
    passed = 0
    for n, f in tests:
        try:
            f()
            passed += 1
        except AssertionError as e:
            print(f"FAIL {n}: {e}")
    print(f"{passed}/{len(tests)} passed")
