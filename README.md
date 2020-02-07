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
pick names for assertions with a track record of being misinterpreted,
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

You may pass any of the functions an item to be tested as a promise,
and it will be tested after the promise is resolved.  In this case, the
test will return a promise which will be resolved or rejected as appropriate.
A promise-aware test runner (e.g. [Mocha](https://mochajs.org/)
version >= 1.18.0) is highly recommended.

These docs show a typical invocation, and what you see when it failed:


### `expect`
```javascript
// fail if bool != true
assert.expect(bool);
```

```javascript
expect('2 > 1', 2 > 1);
// Assertion failed: 2 > 1
```


### `truthy`

**Note**: Using `truthy` in your tests is a code smell.
More often than not there is another, more precise test.
Only use `truthy` when there is no way of knowing what the actual value will be.
If `bool` is the result of a boolean operation, use `expect`.
If `bool` is an unknown value, use `match` or `include` to narrow it down.

```javascript
// fail if !bool
assert.truthy(bool);
assert.truthy(explanation, bool);
```

```javascript
truthy('something was populated in the email field', form.email.value);

// Assertion failed: something was populated in the email field
// expected undefined to be truthy
```


### `equal`
```javascript
// fail unless actual === expected
assert.equal(expected, actual);
assert.equal(explanation, expected, actual);

// Assertion failed: decode the Epoch to 0s after Jan 1st, 1970
// Expected 86400000 to be
// equal to 0
```

### `deepEqual`
```javascript
// fail unless _.isEqual(expected, actual)
assert.deepEqual(expected, actual);
assert.deepEqual(explanation, expected, actual);

/*
Assertion failed: ensure that all methods we tested were handled, and in the right order
Actual: - Expected: +
  {
    "methods": [
      "GET",
-     "GET",
+     "POST",
+     "PUT",
+     "DELETE"
    ]
  }
*/
```

### `include`
```javascript
// fail unless haystack has a substring needle, or _.include haystack, needle
assert.include(needle, haystack);
assert.include(explanation, needle, haystack);

// Assertion failed: only accept supported, case-normalized method names
// expected ["GET","POST","PUT","DELETE"]
// to include "get"
```

### `match`
```javascript
// fail unless regexp matches the given string, or regexp.test string
assert.match(regexp, string);
assert.match(explanation, regexp, needle);

// Assertion failed: only affirmative pirate answers accepted
// Expected: /aye|yar+/
// to match: "nay"
```

### `throws`
```javascript
// fail unless the provided functionThatThrows() calls throw
// (on non-failures the return value is whatever was thrown)
const err = assert.throws(functionThatThrows);
const err = assert.throws(explanation, functionThatThrows);

// Assertion failed: ensure that bad inputs throw an error
// didn't throw an exception as expected to
```

### `hasType`
```javascript
// fail unless _.isType(value) is true for given Type, or the
// same test for a more specific type (listed above) was true
assert.hasType(<type>, value);
assert.hasType(explanation, <type>, value);

// Examples
assert.hasType(null, value);
assert.hasType(undefined, value);
assert.hasType(Date, value);
assert.hasType(Array, value);
assert.hasType(String, value);
assert.hasType(RegExp, value);
assert.hasType(Boolean, value);
assert.hasType(Function, value); // this will be assert for any type of function: normal, async and generator functions
assert.hasType('AsyncFunction', value);
assert.hasType('GeneratorFunction', value);
assert.hasType(Object, value);
assert.hasType(Promise, value);
assert.hasType(NaN, value);
assert.hasType(Number, value);
assert.hasType(Symbol, value);
assert.hasType(Map, value);
assert.hasType(WeakMap, value);
assert.hasType(Set, value);
assert.hasType(WeakSet, value);
assert.hasType(DataView, value);
assert.hasType(ArrayBuffer, value);
assert.hasType(Error, value);
```

### `resolves`
```javascript
// Wait for promise to resolve, then resolve if successful, reject otherwise
// Always returns a promise, unless called with non-promise (not allowed)
const samePromise = assert.resolves(promise);
const samePromise = assert.resolves(explanation, promise);

// Assertion failed: should resolve to good stuff
// Promise was rejected despite resolves assertion:
// Timeout in 10000ms
```

### `rejects`
```javascript
// Wait for promise to reject, resolve with error if it does, reject otherwise
// Basically inverse of resolves(), but resolves with the error for more testing
// Always returns a promise, unless called with non-promise (not allowed)
const promiseForErr = assert.rejects(promise)
const promiseForErr = assert.rejects(explanation, promise)

// Assertion failed: should reject after Timeout
// Promise wasn't rejected as expected to
```

### `falsey`, `notEqual`, `notDeepEqual`, `notInclude`, `notMatch`, `notThrows`, `notHasType`
Versions of the above functions taking the same arguments, but asserting
the opposite outcome. The assertion failure messages are just as helpful.

License
----------------------------------------------------------------------

[BSD 3-Clause open source license](LICENSE)
