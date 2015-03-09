assertive
=========

A terse, yet expressive assertion library

Is Assertive different from other assertion libraries?
----------------------------------------------------------------------

Assertive aims to make the exact cause of breakage and intent of tests
as fast and easy to spot as possible, with much attention paid to both
the colour and alignment of expected and actual data, so you should be
able to glean what you need immediately.

It also tries to pre-empt false negative tests from ever happening, by
rigorously testing for correct assertion invocation and by avoiding to
pick names for assertions with a treck record of being misinterpreted,
not just by people reading the code, but also by programmers _writing_
them, which can make even 100%-test-coverage code fail on behalf of it
testing for the wrong thing.

Semantic Versioning
----------------------------------------------------------------------

Assertive uses [semver](http://semver.org/) version numbers, though we
should point out that we may tighten assertion checks in minor version
number updates, making code that previously silently passed, now fail.

Case in point: before v1.3.0, code using an assertion to verify that a
string included the empty string, would do just that. In other words -
nothing, since that assertion does not test anything. Now, such a test
is flagged as a bug in your test suite that you should fix, as that is
not asserting something about your code, but about strings in general.

In Assertive, breaking changes implying a major version bump, would be
things like argument order changes. If you really do not want improved
coverage against this type of error with a random minor version update
you should pin a version you like in your `package.json` rather than a
version range.

Usage
----------------------------------------------------------------------

Each assertion lets you state a condition and an optional help message
about what semantics your test asserts, which gets presented first, if
the assertion fails. (This is generally much more useful than messages
along the lines of "expected true to be false", especially when it may
be hard to tell later what the intended purpose of a test really was.)

Besides failing when what each assertion guards against, they also all
fail if you pass too few, too many or otherwise illegal parameters, as
when a tired programmer expects "expect" to compare the two parameters
he passed in some way and trip when they mismatch, though all it would
ever test is that the first was truthy. To not get test suites full of
almost-no-op tests like that, Assertive fails straight away like this:

```
Expected: true
Actually: 10
```

There have been test suites full of no-op tests similar to this, which
have gone undetected for months or years, giving a false sense of what
regressions you are guarded against.

These docs show a typical invocation, and what you see when it failed:


### `expect`
```
assert.expect(bool)
# fail if bool != true
```

```
expect '2 > 1', 2 > 1

Assertion failed: 2 > 1
```


### `truthy`

**Note**: Using `truthy` in your tests is a code smell.
More often than not there is another, more precise test.
Only use `truthy` when there is no way of knowing what the actual value will be.
If `bool` is the result of a boolean operation, use `expect`.
If `bool` is an unknown value, use `match` or `include` to narrow it down.

```
assert.truthy(bool)
assert.truthy(explanation, bool)
# fail if !bool
```

```
truthy 'something was populated in the email field', form.email.value

Assertion failed: something was populated in the email field
expected undefined to be truthy
```


### `equal`
```
assert.equal(expected, actual)
assert.equal(explanation, expected, actual)
# fail unless actual === expected

Assertion failed: decode the Epoch to 0s after Jan 1st, 1970
Expected 86400000 to be
equal to 0
```

### `deepEqual`
```
assert.deepEqual(expected, actual)
assert.deepEqual(explanation, expected, actual)
# fail unless _.isEqual(expected, actual)

Assertion failed: ensure that all methods we tested were handled, and in the right order
mismatch: {"methods":["GET"]} didn't
deepEqual {"methods":["GET","POST","PUT","DELETE"]}
```

### `include`
```
assert.include(needle, haystack)
assert.include(explanation, needle, haystack)
# fail unless haystack has a substring needle, or _.include haystack, needle

Assertion failed: only accept supported, case-normalized method names
expected ["GET","POST","PUT","DELETE"]
to include "get"
```

### `match`
```
assert.match(regexp, string)
assert.match(explanation, regexp, needle)
# fail unless regexp matches the given string, or regexp.test string

Assertion failed: only affirmative pirate answers accepted
Expected: /aye|yar+/
to match: "nay"
```

### `throws`
```
err = assert.throws(functionThatThrows)
err = assert.throws(explanation, functionThatThrows)
# fail unless the provided functionThatThrows() calls throw
# (on non-failures the return value is whatever was thrown)

Assertion failed: ensure that bad inputs throw an error
didn't throw an exception as expected to
```

### `hasType`
```
assert.hasType(<type>, value);
assert.hasType(explanation, <type>, value);
assert.hasType(null, value)
assert.hasType(Date, value)
assert.hasType(Array, value)
assert.hasType(String, value)
assert.hasType(RegExp, value)
assert.hasType(Boolean, value)
assert.hasType(Function, value)
assert.hasType(Object, value)
assert.hasType(NaN, value)
assert.hasType(Number, value)
assert.hasType(undefined, value)
# fail unless _.isType(value) is true for given Type, or the
# same test for a more specific type (listed above) was true
```

### `falsey`, `notEqual`, `notDeepEqual`, `notInclude`, `notMatch`, `notThrows`, `notHasType`
Versions of the above functions taking the same arguments, but asserting
the opposite outcome. The assertion failure messages are just as helpful.


License
----------------------------------------------------------------------

[BSD 3-Clause open source license](LICENSE)
