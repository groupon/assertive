/*
 * Copyright (c) 2013, Groupon, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *
 * Neither the name of GROUPON nor the names of its contributors may be
 * used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

'use strict';

let assert;

const isEqual = require('lodash.isequal');

const toString = Object.prototype.toString;

let green = x => `\x1B[32m${x}\x1B[39m`;
let red = x => `\x1B[31m${x}\x1B[39m`;
let clear = '\x1b[39;49;00m';
const is = {};
if (!(typeof process === 'object' && process.stdout && process.stdout.isTTY)) {
  red = x => `${x}`;
  green = red;
  clear = '';
}

/**
 * @param {string} buildInType
 * @param {any} obj
 * @return {boolean}
 */
function assertPrototype(buildInType, obj) {
  if (is.Undefined(obj) || is.Null(obj)) {
    return false;
  }
  return Object.getPrototypeOf(obj).constructor.name === buildInType;
}

// listing the most specific types first lets us iterate in order and verify that
// the expected type was the first match
const types = new Set([
  'null',
  'Date',
  'Array',
  'ArrayBuffer',
  'String',
  'RegExp',
  'Boolean',
  'Promise',
  'Object',
  'NaN',
  'Number',
  'Map',
  'Set',
  'WeakMap',
  'WeakSet',
  'Symbol',
  'undefined',
  'Function',
  'AsyncFunction',
  'GeneratorFunction',
  'DataView',
  'Error',
]);

types.forEach(
  buildInType => (is[buildInType] = assertPrototype.bind(null, buildInType))
);

is.Function = function(obj) {
  return (
    assertPrototype('Function', obj) ||
    is.AsyncFunction(obj) ||
    is.GeneratorFunction(obj)
  );
};
// Overwrite special cases
/**
 * @param {any} obj
 * @return {boolean}
 * @constructor
 */
is.NaN = function(obj) {
  return !!is.Number(obj) && isNaN(obj);
};

/**
 * @param {any} obj
 * @return {boolean}
 * @constructor
 */
is.Undefined = function(obj) {
  return obj === undefined;
};

/**
 * @param {any} obj
 * @return {boolean}
 * @constructor
 */
is.Null = function(obj) {
  return obj === null;
};

function error(message, explanation, errProps) {
  if (explanation != null) {
    message = `Assertion failed: ${explanation}\n${clear}${message}`;
  }
  const err = new Error(message);
  if (errProps) {
    Object.keys(errProps).forEach(prop => {
      err[prop] = errProps[prop];
    });
  }
  return err;
}

function nameNegative(name) {
  if (name === 'truthy') {
    return 'falsey';
  }
  if (name === 'resolves') {
    return 'rejects';
  }
  return `not${name.charAt().toUpperCase()}${name.slice(1)}`;
}

function asRegExp(re) {
  let flags = '';
  if (re.global) flags += 'g';
  if (re.multiline) flags += 'm';
  if (re.ignoreCase) flags += 'i';
  return `/${re.source}/${flags}`;
}

function stringifyReplacer(key, val) {
  if (typeof val === 'function') return toString.call(val);
  if (is.RegExp(val)) return asRegExp(val);
  if (is.Object(val) && !is.Array(val)) {
    return Object.keys(val)
      .sort()
      .reduce((o, p) => ({ ...o, [p]: val[p] }), {});
  }
  return val;
}

function stringify(x) {
  if (x == null) return `${x}`;
  if (is.NaN(x)) return 'NaN';
  if (is.RegExp(x)) return asRegExp(x);
  if (typeof x === 'symbol') return x.toString();
  const json = JSON.stringify(x, stringifyReplacer, 2);
  const className = x && x.constructor && x.constructor.name;
  if (
    typeof x !== 'object' ||
    className === 'Object' ||
    className === 'Array'
  ) {
    return json;
  }

  if (x instanceof Error || /Error/.test(className)) {
    if (json === '{}') {
      return x.stack;
    }
    return `${x.stack}\nwith error metadata:\n${json}`;
  }
  if (x.toString === toString) {
    return className;
  }
  try {
    return `${className}[${x}]`;
  } catch (e) {
    return className;
  }
}

// assert that the function got `count` args (if an integer), one of the number
// of args (if an array of legal counts), and if it was an array and the count
// was equal to the last option (fully populated), that the first arg is a String
// (that test's semantic explanation)
function handleArgs(self, count, args, name, help) {
  let negated = false;
  if (is.String(self)) {
    negated = true;
    name = nameNegative(name);
  }

  const argc = args.length;
  if (argc === count) return [name, negated];

  let max = '';
  if (is.Array(count) && count.indexOf(argc) !== -1) {
    const n = count[count.length - 1];
    if (argc !== n || is.String(args[0])) return [name, negated];
    max = `,\nand when called with ${n} args, the first arg must be a docstring`;
  }

  let wantedArgCount;
  if (is.Number(count)) {
    wantedArgCount = `${count} argument`;
  } else {
    wantedArgCount = count.slice(0, -1).join(', ');
    count = count.pop();
    wantedArgCount = `${wantedArgCount} or ${count} argument`;
  }
  if (count !== 1) wantedArgCount += 's';

  const actualArgs = stringify([].slice.call(args)).slice(1, -1);

  const functionSource = Function.prototype.toString.call(assert[name]);
  let wantedArgNames = functionSource.match(/^function\s*[^(]*\s*\(([^)]*)/)[1];
  if (max) {
    wantedArgNames = `explanation, ${wantedArgNames}`;
  }

  const wanted = `${name}(${wantedArgNames})`;
  const actual = `${name}(${actualArgs})`;
  const message = `${green(wanted)} needs ${wantedArgCount + max}
your usage: ${red(actual)}`;

  if (typeof help === 'function') {
    help = help();
  }
  throw error(message, help);
}

function type(x) {
  if (is.String(x)) return 'String';
  if (is.Number(x)) return 'Number';
  if (is.RegExp(x)) return 'RegExp';
  if (is.Array(x)) return 'Array';
  throw new TypeError(`unsupported type: ${x}`);
}

function abbreviate(name, value, threshold) {
  const str = stringify(value);
  if (str.length <= (threshold || 1024)) return str;
  let desc = `length: ${value.length}`;
  if (is.Array(value)) desc += `; ${str.length} JSON encoded`;
  if (name) name += ' ';
  return `${name}${type(value)}[${desc}]`;
}

// translates any argument we were meant to interpret as a type, into its name
function getNameOfType(x) {
  switch (false) {
    case !(x == null):
      return `${x}`; // null / undefined
    case !is.String(x):
      return x;
    case !is.Function(x):
      return x.name;
    case !is.NaN(x):
      return 'NaN';
    default:
      return x;
  }
}

function implodeNicely(list, conjunction) {
  const first = list.slice(0, -1).join(', ');
  const last = list[list.length - 1];
  return `${first} ${conjunction || 'and'} ${last}`;
}

function isType(value, typeName) {
  if (typeName === 'Date') {
    return is.Date(value) && !is.NaN(+value);
  }
  typeName = `${typeName[0].toUpperCase()}${typeName.slice(1)}`;

  return is[typeName](value);
}

// gets the name of the type that value is an incarnation of
function getTypeNames(value) {
  return [...types].filter(isType.bind(null, value));
}

const assertSync = {
  truthy(bool) {
    const args = handleArgs(this, [1, 2], arguments, 'truthy');
    const name = args[0];
    const negated = args[1];
    let explanation;
    if (arguments.length === 2) {
      explanation = arguments[0];
      bool = arguments[1];
    }
    if ((!bool && !negated) || (bool && negated)) {
      throw error(
        `Expected ${red(stringify(bool))} to be ${name}`,
        explanation
      );
    }
  },

  expect(bool) {
    let explanation;
    if (arguments.length === 2) {
      explanation = arguments[0];
      bool = arguments[1];
    }
    if (explanation) return assertSync.equal(explanation, true, bool);
    return assertSync.equal(true, bool);
  },

  equal(expected, actual) {
    let explanation;
    const negated = handleArgs(this, [2, 3], arguments, 'equal')[1];
    if (arguments.length === 3) {
      explanation = arguments[0];
      expected = arguments[1];
      actual = arguments[2];
    }
    if (negated) {
      if (expected === actual) {
        throw error(
          `notEqual assertion expected ${red(stringify(actual))}` +
            ' to be exactly anything else',
          explanation
        );
      }
    } else if (expected !== actual) {
      throw error(
        `Expected: ${green(stringify(expected))}\nActually: ` +
          `${red(stringify(actual))}`,
        explanation,
        { actual, expected }
      );
    }
  },

  deepEqual(expected, actual) {
    let explanation;
    const negated = handleArgs(this, [2, 3], arguments, 'deepEqual')[1];
    if (arguments.length === 3) {
      explanation = arguments[0];
      expected = arguments[1];
      actual = arguments[2];
    }
    const isEq = isEqual(expected, actual);
    if ((isEq && !negated) || (!isEq && negated)) return;

    const wrongLooks = stringify(actual);
    if (negated) {
      throw error(
        `notDeepEqual assertion expected exactly anything else but
${red(wrongLooks)}`,
        explanation
      );
    }

    const rightLooks = stringify(expected);
    let message;
    if (wrongLooks === rightLooks) {
      message =
        `deepEqual ${green(rightLooks)} failed on something that\n` +
        'serializes to the same result (likely some function)';
    } else {
      message = `Expected: ${wrongLooks} to deepEqual ${rightLooks}`;
    }

    throw error(message, explanation, { expected, actual });
  },

  include(needle, haystack) {
    const args = handleArgs(this, [2, 3], arguments, 'include');
    const name = args[0];
    const negated = args[1];
    let explanation;
    if (arguments.length === 3) {
      explanation = arguments[0];
      needle = arguments[1];
      haystack = arguments[2];
    }
    if (is.String(haystack)) {
      if (needle === '') {
        const what = negated ? 'always-failing test' : 'no-op test';
        throw error(`${what} detected: all strings contain the empty string!`);
      }
      if (!is.String(needle) && !is.Number(needle) && !is.RegExp(needle)) {
        const problem =
          'needs a RegExp/String/Number needle for a String haystack';
        throw new TypeError(
          `${name} ${problem}; you used:\n` +
            `${name} ${green(stringify(haystack))}, ${red(stringify(needle))}`
        );
      }
    } else if (!is.Array(haystack)) {
      needle = stringify(needle);
      throw new TypeError(`${name} takes a String or Array haystack; you used:
${name} ${red(stringify(haystack))}, ${needle}`);
    }

    const contained =
      is.String(haystack) && is.RegExp(needle)
        ? haystack.match(needle)
        : haystack.indexOf(needle) > -1;

    if (negated) {
      if (contained) {
        let message = `${'notInclude expected needle not to be found in ' +
          `haystack\n- needle: ${stringify(needle)}\n haystack: `}${abbreviate(
          '',
          haystack
        )}`;
        if (is.String(haystack) && is.RegExp(needle)) {
          message += ', but found:\n';
          if (needle.global) {
            message += contained.map(s => `* ${red(stringify(s))}`).join('\n');
          } else {
            message += `* ${red(stringify(contained[0]))}`;
          }
        }
        throw error(message, explanation);
      }
    } else if (!contained) {
      throw error(
        `${name} expected needle to be found in haystack\n` +
          `- needle: ${stringify(needle)}\n` +
          `haystack: ${abbreviate('', haystack)}`,
        explanation
      );
    }
  },

  match(regexp, string) {
    const args = handleArgs(this, [2, 3], arguments, 'match');
    const name = args[0];
    const negated = args[1];
    let explanation;
    if (arguments.length === 3) {
      explanation = arguments[0];
      regexp = arguments[1];
      string = arguments[2];
    }

    const re = is.RegExp(regexp);
    if (!re || !is.String(string)) {
      string = abbreviate('string', string);
      const oops = re
        ? 'string arg is not a String'
        : 'regexp arg is not a RegExp';
      const called = `${name} ${stringify(regexp)}, ${red(string)}`;
      throw new TypeError(`${name}: ${oops}; you used:\n${called}`);
    }

    const matched = regexp.test(string);
    if (negated) {
      if (!matched) return;
      let message =
        `Expected: ${stringify(regexp)}\nnot to match: ` +
        `${red(abbreviate('string', string))}`;
      if (regexp.global) {
        const count = string.match(regexp).length;
        message += `\nMatches: ${red(count)}`;
      }
      throw error(message, explanation);
    }
    if (!matched) {
      throw error(
        `Expected: ${stringify(regexp)}\nto match: ` +
          `${red(abbreviate('string', string))}`,
        explanation
      );
    }
  },

  throws(fn) {
    const args = handleArgs(this, [1, 2], arguments, 'throws');
    const name = args[0];
    const negated = args[1];
    let explanation;
    if (arguments.length === 2) {
      explanation = arguments[0];
      fn = arguments[1];
    }
    if (typeof explanation === 'function') {
      fn = explanation;
      explanation = undefined;
    }
    if (typeof fn !== 'function') {
      throw error(`${name} expects ${green('a function')} but got ${red(fn)}`);
    }

    try {
      fn();
    } catch (err) {
      if (negated) {
        throw error(
          `Threw an exception despite ${name} assertion:\n` + `${err.message}`,
          explanation
        );
      }
      return err;
    }

    if (negated) return null;
    throw error("Didn't throw an exception as expected to", explanation);
  },

  hasType(expectedType, value) {
    const args = handleArgs(this, [2, 3], arguments, 'hasType');
    const name = args[0];
    const negated = args[1];
    let explanation;
    if (arguments.length === 3) {
      explanation = arguments[0];
      expectedType = arguments[1];
      value = arguments[2];
    }

    const stringType = getNameOfType(expectedType);
    if (!types.has(stringType)) {
      const badArg = stringify(expectedType);
      const suggestions = implodeNicely([...types], 'or');
      throw new TypeError(
        `${name}: unknown expectedType ${badArg}; you used:\n${name} ` +
          `${red(badArg)}, ${stringify(value)}\nDid you mean ${suggestions}?`
      );
    }

    const typeMatches = getTypeNames(value).includes(stringType);
    if ((!typeMatches && !negated) || (typeMatches && negated)) {
      value = red(stringify(value));
      const toBeOrNotToBe = `${negated ? 'not ' : ''}to be`;
      const message = `Expected value ${value} ${toBeOrNotToBe} of type ${stringType}`;
      throw error(message, explanation);
    }
  },
};

// produce negatived versions of all the common assertion functions
const positiveAssertions = [
  'truthy',
  'equal',
  'deepEqual',
  'include',
  'match',
  'throws',
  'hasType',
];
positiveAssertions.forEach(name => {
  assertSync[nameNegative(name)] = function _oneTest() {
    return assertSync[name].apply('!', arguments);
  };
});

// borrowed from Q
function isPromiseAlike(p) {
  return p === Object(p) && typeof p.then === 'function';
}

// promise-specific tests
assert = {
  resolves(testee) {
    const name = handleArgs(this, [1, 2], arguments, 'resolves')[0];
    let explanation;
    if (arguments.length === 2) {
      explanation = arguments[0];
      testee = arguments[1];
    }

    if (!isPromiseAlike(testee)) {
      throw error(
        `${name} expects ${green('a promise')} but got ${red(
          stringify(testee)
        )}`
      );
    }

    if (name === 'rejects') {
      return testee.then(
        () => {
          throw error("Promise wasn't rejected as expected to", explanation);
        },
        x => x
      );
    }
    return testee.catch(err => {
      throw error(
        'Promise was rejected despite resolves assertion:\n' +
          `${(err && err.message) || err}`,
        explanation
      );
    });
  },

  rejects() {
    return assert.resolves.apply('!', arguments);
  },
};

// union of promise-specific and promise-aware wrapped synchronous tests
if (assertSync) {
  Object.keys(assertSync).forEach(name => {
    const fn = assertSync[name];
    assert[name] = function _oneTest() {
      if (arguments.length === 0) return fn();
      const args = [].slice.call(arguments);
      const testee = args.pop();
      if (isPromiseAlike(testee)) {
        return testee.then(val => fn(...args, val));
      }
      return fn(...args, testee);
    };
  });
}

module.exports = assert;
