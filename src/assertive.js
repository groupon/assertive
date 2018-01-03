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

// eat _ off the global scope, or require it ourselves if missing
// eslint-disable-next-line no-new-func
const global = Function('return this')();
let assert;

// eslint-disable-next-line global-require
const _ = global._ || require('lodash');

const toString = Object.prototype.toString;

let green = x => `\x1B[32m${x}\x1B[39m`;
let red = x => `\x1B[31m${x}\x1B[39m`;
let clear = '\x1b[39;49;00m';

if (!(global.process && process.stdout && process.stdout.isTTY)) {
  red = x => `${x}`;
  green = red;
  clear = '';
}

function error(message, explanation, errProps) {
  if (explanation != null) {
    message = `Assertion failed: ${explanation}\n${clear}${message}`;
  }
  const err = new Error(message);
  if (errProps) _.assign(err, errProps);
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
  if (typeof val === 'function') return toString(val);
  if (_.isRegExp(val)) return asRegExp(val);
  if (_.isObject(val) && !_.isArray(val)) {
    return _(val)
      .toPairs()
      .sortBy(0)
      .fromPairs()
      .value();
  }
  return val;
}

function stringify(x) {
  if (x == null) return `${x}`;
  if (_.isNaN(x)) return 'NaN';
  if (_.isRegExp(x)) return asRegExp(x);
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
  if (_.isString(self)) {
    negated = true;
    name = nameNegative(name);
  }

  const argc = args.length;
  if (argc === count) return [name, negated];

  let max = '';
  if (_.isArray(count) && count.indexOf(argc) !== -1) {
    const n = count[count.length - 1];
    if (argc !== n || _.isString(args[0])) return [name, negated];
    max = `,\nand when called with ${n} args, the first arg must be a docstring`;
  }

  let wantedArgCount;
  if (_.isNumber(count)) {
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
  if (_.isString(x)) return 'String';
  if (_.isNumber(x)) return 'Number';
  if (_.isRegExp(x)) return 'RegExp';
  if (_.isArray(x)) return 'Array';
  throw new TypeError(`unsupported type: ${x}`);
}

function abbreviate(name, value, threshold) {
  const str = stringify(value);
  if (str.length <= (threshold || 1024)) return str;
  let desc = `length: ${value.length}`;
  if (_.isArray(value)) desc += `; ${str.length} JSON encoded`;
  if (name) name += ' ';
  return `${name}${type(value)}[${desc}]`;
}

// translates any argument we were meant to interpret as a type, into its name
function getNameOfType(x) {
  switch (false) {
    case !(x == null):
      return `${x}`; // null / undefined
    case !_.isString(x):
      return x;
    case !_.isFunction(x):
      return x.name;
    case !_.isNaN(x):
      return 'NaN';
    default:
      return x;
  }
}

// listing the most specific types first lets us iterate in order and verify that
// the expected type was the first match
const types = [
  'null',
  'Date',
  'Array',
  'String',
  'RegExp',
  'Boolean',
  'Function',
  'Object',
  'NaN',
  'Number',
  'undefined',
];

function implodeNicely(list, conjunction) {
  const first = list.slice(0, -1).join(', ');
  const last = list[list.length - 1];
  return `${first} ${conjunction || 'and'} ${last}`;
}

function isType(value, typeName) {
  if (typeName === 'Date') return _.isDate(value) && !_.isNaN(+value);
  return _[`is${typeName[0].toUpperCase()}${typeName.slice(1)}`](value);
}

// gets the name of the type that value is an incarnation of
function getTypeName(value) {
  return _.find(types, _.partial(isType, value));
}

/* eslint-disable prefer-rest-params */
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
    const isEqual = _.isEqual(expected, actual);
    if ((isEqual && !negated) || (!isEqual && negated)) return;

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
    if (_.isString(haystack)) {
      if (needle === '') {
        const what = negated ? 'always-failing test' : 'no-op test';
        throw error(`${what} detected: all strings contain the empty string!`);
      }
      if (!_.isString(needle) && !_.isNumber(needle) && !_.isRegExp(needle)) {
        const problem =
          'needs a RegExp/String/Number needle for a String haystack';
        throw new TypeError(
          `${name} ${problem}; you used:\n` +
            `${name} ${green(stringify(haystack))}, ${red(stringify(needle))}`
        );
      }
    } else if (!_.isArray(haystack)) {
      needle = stringify(needle);
      throw new TypeError(`${name} takes a String or Array haystack; you used:
${name} ${red(stringify(haystack))}, ${needle}`);
    }

    let contained;
    if (_.isString(haystack)) {
      if (_.isRegExp(needle)) {
        contained = haystack.match(needle);
      } else {
        contained = haystack.indexOf(needle) !== -1;
      }
    } else {
      contained = _.includes(haystack, needle);
    }

    if (negated) {
      if (contained) {
        // eslint-disable-next-line prefer-template
        let message = `${'notInclude expected needle not to be found in ' +
          `haystack\n- needle: ${stringify(needle)}\n haystack: `}${abbreviate(
          '',
          haystack
        )}`;
        if (_.isString(haystack) && _.isRegExp(needle)) {
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

    const re = _.isRegExp(regexp);
    if (!re || !_.isString(string)) {
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

    if (negated) return undefined;
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
    if (types.indexOf(stringType) === -1) {
      const badArg = stringify(expectedType);
      const suggestions = implodeNicely(types, 'or');
      throw new TypeError(
        `${name}: unknown expectedType ${badArg}; you used:\n${name} ` +
          `${red(badArg)}, ${stringify(value)}\nDid you mean ${suggestions}?`
      );
    }

    const typeMatches = stringType === getTypeName(value);
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
      return testee.then(() => {
        throw error("Promise wasn't rejected as expected to", explanation);
      }, _.identity);
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
_.forEach(assertSync || {}, (fn, name) => {
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

// export as a module to node - or to the global scope, if not
if (typeof module !== 'undefined' && module && module.exports) {
  module.exports = assert;
} else {
  global.assert = assert;
}
