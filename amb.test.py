"""Tests for amb. Run with `pytest amb.test.py` or `python amb.test.py`."""

from amb import amb_run, amb_all, FAIL


# Examples — illustrate what amb is for and how it reads.

def test_factorization():
    def f(amb, fail):
        return amb([1, 2, 3], lambda x:
            amb([4, 5, 6], lambda y:
                [x, y] if x * y == 8 else fail()))
    assert amb_run(f) == [2, 4]


def test_four_word_chain():
    linked = lambda a, b: a[-1] == b[0]
    def f(amb, fail):
        def at_w2(w1, w2):
            if not linked(w1, w2): return fail()
            return amb(["walked", "treaded", "grows"], lambda w3:
                fail() if not linked(w2, w3)
                else amb(["slowly", "quickly"], lambda w4:
                    fail() if not linked(w3, w4)
                    else " ".join([w1, w2, w3, w4])))
        return amb(["the", "that", "a"], lambda w1:
            amb(["frog", "elephant", "thing"], lambda w2: at_w2(w1, w2)))
    assert amb_run(f) == "that thing grows slowly"


def test_pythagorean_in_1_to_6():
    def f(amb, fail):
        rng = [1, 2, 3, 4, 5, 6]
        return amb(rng, lambda a:
            amb(rng, lambda b:
                amb(rng, lambda c:
                    [a, b, c] if a*a == b*b + c*c else fail())))
    assert amb_run(f) == [5, 3, 4]


# SICP §4.3.2: five people on different floors of a 5-story building.
# Baker not on top; Cooper not on bottom; Fletcher not top or bottom;
# Miller higher than Cooper; Smith not adjacent to Fletcher;
# Fletcher not adjacent to Cooper.
def test_baker_cooper_floors():
    floors = [1, 2, 3, 4, 5]
    distinct = lambda *xs: len(set(xs)) == len(xs)
    adj = lambda a, b: abs(a - b) == 1
    def f(amb, fail):
        def at_smith(baker, cooper, fletcher, miller, smith):
            if not distinct(baker, cooper, fletcher, miller, smith):
                return fail()
            if adj(smith, fletcher): return fail()
            return {"baker": baker, "cooper": cooper,
                    "fletcher": fletcher, "miller": miller, "smith": smith}
        return amb(floors, lambda baker:
            fail() if baker == 5
            else amb(floors, lambda cooper:
                fail() if cooper == 1
                else amb(floors, lambda fletcher:
                    fail() if fletcher in (1, 5) or adj(fletcher, cooper)
                    else amb(floors, lambda miller:
                        fail() if miller <= cooper
                        else amb(floors, lambda smith:
                            at_smith(baker, cooper, fletcher,
                                     miller, smith))))))
    assert amb_run(f) == {
        "baker": 3, "cooper": 2, "fletcher": 4, "miller": 5, "smith": 1,
    }


# Implementation — coverage of the operator's behavior.

def test_no_amb_calls():
    assert amb_run(lambda amb, fail: 42) == 42


def test_returning_fail_at_top():
    assert amb_run(lambda amb, fail: FAIL) is None
    assert amb_run(lambda amb, fail: fail()) is None


def test_amb_with_empty_choices_returns_fail():
    assert amb_run(lambda amb, fail: amb([], lambda c: 1)) is None


def test_single_amb_first_value_no_constraint():
    r = amb_run(lambda amb, fail: amb([1, 2, 3], lambda x: x))
    assert r == 1


def test_single_amb_backtracks_through_fail():
    r = amb_run(lambda amb, fail:
        amb([1, 2, 3], lambda x: x if x == 3 else fail()))
    assert r == 3


def test_no_solution_returns_none():
    r = amb_run(lambda amb, fail: amb([1, 2, 3], lambda x: fail()))
    assert r is None


def test_user_exceptions_propagate():
    def f(amb, fail):
        raise ValueError("oops")
    try:
        amb_run(f)
    except ValueError as e:
        assert "oops" in str(e)
        return
    raise AssertionError("expected ValueError")


def test_leftmost_first_dfs_order():
    r = amb_run(lambda amb, fail:
        amb([1, 2, 3, 4], lambda x:
            amb([1, 2, 3, 4, 5, 6, 7, 8], lambda y:
                [x, y] if x * y == 8 else fail())))
    assert r == [1, 8]


def test_amb_all_collects_every_solution():
    sols = amb_all(lambda amb, fail:
        amb([1, 2, 3], lambda x:
            amb([1, 2, 3], lambda y:
                [x, y] if x + y == 4 else fail())))
    assert sols == [[1, 3], [2, 2], [3, 1]]


def test_side_effects_fire_once_per_outer_choice():
    # Each outer-amb callback runs once per outer value; side
    # effects between two amb calls fire that many times — not
    # once per leaf, as throw-and-replay would.
    x_visits = [0]
    def f(amb, fail):
        def k(x):
            x_visits[0] += 1
            return amb([4, 5, 6], lambda y:
                [x, y] if x * y == 8 else fail())
        return amb([1, 2, 3], k)
    amb_run(f)
    assert x_visits[0] == 2  # x=1 (no y works), x=2 (success)


# Pythagorean search with the outer-choice side-effect captured into
# a list so the test can assert it. Outer a iterates 1..7; for each
# a, the inner search runs to completion (or success). The first
# satisfying triple with a ≤ b is (3, 4, 5), so the outer callback
# runs for a = 1, 2, 3 — once each — before the search returns.
def test_outer_choice_side_effect_lands_once_per_a():
    a_values = []
    rng = [1, 2, 3, 4, 5, 6, 7]
    def f(amb, fail):
        def k_a(a):
            a_values.append(a)
            return amb(rng, lambda b:
                amb(rng, lambda c:
                    fail() if a > b
                    else fail() if a*a + b*b != c*c
                    else [a, b, c]))
        return amb(rng, k_a)
    assert amb_run(f) == [3, 4, 5]
    assert a_values == [1, 2, 3]


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
