'use strict';

/*
Copyright (c) 2013, Groupon, Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are
met:

Redistributions of source code must retain the above copyright notice,
this list of conditions and the following disclaimer.

Redistributions in binary form must reproduce the above copyright
notice, this list of conditions and the following disclaimer in the
documentation and/or other materials provided with the distribution.

Neither the name of GROUPON nor the names of its contributors may be
used to endorse or promote products derived from this software without
specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
var _, abbreviate, asRegExp, assert, clear, error, getNameOfType, getTypeName, global, green, handleArgs, i, implodeNicely, includes, isArray, isEqual, isFunction, isNumber, isRegExp, isString, isType, len, map, name, nameNegative, positiveAssertions, red, ref, ref1, ref2, stringify, toString, type, types,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

global = Function('return this')();

ref1 = _ = (ref = global._) != null ? ref : require('lodash'), includes = ref1.includes, isEqual = ref1.isEqual, isString = ref1.isString, isNumber = ref1.isNumber, isRegExp = ref1.isRegExp, isArray = ref1.isArray, isFunction = ref1.isFunction, map = ref1.map;

assert = {
  truthy: function(bool) {
    var explanation, name, negated, ref2;
    ref2 = handleArgs(this, [1, 2], arguments, 'truthy'), name = ref2[0], negated = ref2[1];
    if (arguments.length === 2) {
      explanation = arguments[0], bool = arguments[1];
    }
    if (!((!!bool) ^ negated)) {
      throw error("Expected " + (red(stringify(bool))) + " to be " + name, explanation);
    }
  },
  expect: function(bool) {
    var explanation;
    if (arguments.length === 2) {
      explanation = arguments[0], bool = arguments[1];
    }
    if (explanation) {
      return assert.equal(explanation, true, bool);
    } else {
      return assert.equal(true, bool);
    }
  },
  equal: function(expected, actual) {
    var explanation, name, negated, ref2;
    ref2 = handleArgs(this, [2, 3], arguments, 'equal'), name = ref2[0], negated = ref2[1];
    if (arguments.length === 3) {
      explanation = arguments[0], expected = arguments[1], actual = arguments[2];
    }
    if (negated) {
      if (expected === actual) {
        throw error('notEqual assertion expected ' + red(stringify(actual)) + ' to be exactly anything else', explanation);
      }
    } else if (expected !== actual) {
      throw error("Expected: " + (green(stringify(expected))) + "\nActually: " + (red(stringify(actual))), explanation);
    }
  },
  deepEqual: function(expected, actual) {
    var explanation, message, name, negated, ref2, rightLooks, wrongLooks;
    ref2 = handleArgs(this, [2, 3], arguments, 'deepEqual'), name = ref2[0], negated = ref2[1];
    if (arguments.length === 3) {
      explanation = arguments[0], expected = arguments[1], actual = arguments[2];
    }
    if (!(isEqual(expected, actual) ^ negated)) {
      wrongLooks = stringify(actual);
      if (negated) {
        throw error("notDeepEqual assertion expected exactly anything else but\n" + (red(wrongLooks)), explanation);
      }
      rightLooks = stringify(expected);
      message = wrongLooks === rightLooks ? "deepEqual " + (green(rightLooks)) + " failed on something that\nserializes to the same result (likely some function)" : "Expected: " + (green(rightLooks)) + "\nActually: " + (red(wrongLooks));
      throw error(message, explanation);
    }
  },
  include: function(needle, haystack) {
    var contained, explanation, message, name, negated, problem, ref2, verb, what;
    ref2 = handleArgs(this, [2, 3], arguments, 'include'), name = ref2[0], negated = ref2[1];
    if (arguments.length === 3) {
      explanation = arguments[0], needle = arguments[1], haystack = arguments[2];
    }
    if (isString(haystack)) {
      if (needle === '') {
        what = negated ? 'always-failing test' : 'no-op test';
        throw error(what + " detected: all strings contain the empty string!");
      }
      if (!(isString(needle) || isNumber(needle) || isRegExp(needle))) {
        problem = 'needs a RegExp/String/Number needle for a String haystack';
        throw new TypeError(name + " " + problem + "; you used:\n" + name + " " + (green(stringify(haystack))) + ", " + (red(stringify(needle))));
      }
    } else if (!isArray(haystack)) {
      needle = stringify(needle);
      throw new TypeError(name + " takes a String or Array haystack; you used:\n" + name + " " + (red(stringify(haystack))) + ", " + needle);
    }
    if (isString(haystack)) {
      if (isRegExp(needle)) {
        contained = haystack.match(needle);
      } else {
        contained = haystack.indexOf(needle) !== -1;
      }
    } else {
      contained = includes(haystack, needle);
    }
    verb = isRegExp(needle) ? 'match' : 'include';
    if (negated) {
      if (contained) {
        message = "notInclude expected needle not to be found in haystack\n- needle: " + (stringify(needle)) + "\nhaystack: " + (abbreviate('', haystack));
        if (isString(haystack) && isRegExp(needle)) {
          message += ', but found:\n';
          if (needle.global) {
            message += contained.map(function(s) {
              return "* " + (red(stringify(s)));
            }).join('\n');
          } else {
            message += "* " + (red(stringify(contained[0])));
          }
        }
        throw error(message, explanation);
      }
    } else if (!contained) {
      throw error(name + " expected needle to be found in haystack\n- needle: " + (stringify(needle)) + "\nhaystack: " + (abbreviate('', haystack)), explanation);
    }
  },
  match: function(regexp, string) {
    var called, count, explanation, matched, message, name, negated, oops, re, ref2;
    ref2 = handleArgs(this, [2, 3], arguments, 'match'), name = ref2[0], negated = ref2[1];
    if (arguments.length === 3) {
      explanation = arguments[0], regexp = arguments[1], string = arguments[2];
    }
    if (!((re = isRegExp(regexp)) && isString(string))) {
      string = abbreviate('string', string);
      called = name + " " + (stringify(regexp)) + ", " + (red(string));
      if (!re) {
        oops = 'regexp arg is not a RegExp';
      } else {
        oops = 'string arg is not a String';
      }
      throw new TypeError(name + ": " + oops + "; you used:\n" + called);
    }
    matched = regexp.test(string);
    if (negated) {
      if (!matched) {
        return;
      }
      message = "Expected: " + (stringify(regexp)) + "\nnot to match: " + (red(abbreviate('string', string)));
      if (regexp.global) {
        count = string.match(regexp).length;
        message += "\nMatches: " + (red(count));
      }
      throw error(message, explanation);
    }
    if (matched) {
      return;
    }
    throw error("Expected: " + (stringify(regexp)) + "\nto match: " + (red(abbreviate('string', string))), explanation);
  },
  throws: function(fn) {
    var err, error1, explanation, name, negated, ref2;
    ref2 = handleArgs(this, [1, 2], arguments, 'throws'), name = ref2[0], negated = ref2[1];
    if (arguments.length === 2) {
      explanation = arguments[0], fn = arguments[1];
    }
    if (typeof explanation === 'function') {
      fn = explanation;
      explanation = void 0;
    }
    if (typeof fn !== 'function') {
      throw error(name + " expects " + (green('a function')) + " but got " + (red(fn)));
    }
    try {
      fn();
    } catch (error1) {
      err = error1;
      if (negated) {
        throw error("Threw an exception despite " + name + " assertion:\n" + err.message, explanation);
      }
      return err;
    }
    if (negated) {
      return;
    }
    throw error("Didn't throw an exception as expected to", explanation);
  },
  hasType: function(expectedType, value) {
    var badArg, explanation, message, name, negated, ref2, stringType, suggestions, toBeOrNotToBe;
    ref2 = handleArgs(this, [2, 3], arguments, 'hasType'), name = ref2[0], negated = ref2[1];
    if (arguments.length === 3) {
      explanation = arguments[0], expectedType = arguments[1], value = arguments[2];
    }
    stringType = getNameOfType(expectedType);
    if (indexOf.call(types, stringType) < 0) {
      badArg = stringify(expectedType);
      suggestions = implodeNicely(types, 'or');
      throw new TypeError(name + ": unknown expectedType " + badArg + "; you used:\n" + name + " " + (red(badArg)) + ", " + (stringify(value)) + "\nDid you mean " + suggestions + "?");
    }
    if (!(stringType === getTypeName(value) ^ negated)) {
      value = red(stringify(value));
      toBeOrNotToBe = (negated ? 'not ' : '') + 'to be';
      message = "Expected value " + value + " " + toBeOrNotToBe + " of type " + stringType;
      throw error(message, explanation);
    }
  }
};

nameNegative = function(name) {
  if (name === 'truthy') {
    return 'falsey';
  }
  return 'not' + name.charAt().toUpperCase() + name.slice(1);
};

positiveAssertions = ['truthy', 'equal', 'deepEqual', 'include', 'match', 'throws', 'hasType'];

for (i = 0, len = positiveAssertions.length; i < len; i++) {
  name = positiveAssertions[i];
  assert[nameNegative(name)] = (function(name) {
    return function() {
      return assert[name].apply('!', arguments);
    };
  })(name);
}

types = ['null', 'Date', 'Array', 'String', 'RegExp', 'Boolean', 'Function', 'Object', 'NaN', 'Number', 'undefined'];

isType = function(value, typeName) {
  if (typeName === 'Date') {
    return _.isDate(value) && !_.isNaN(+value);
  }
  return _['is' + typeName.charAt(0).toUpperCase() + typeName.slice(1)](value);
};

getTypeName = function(value) {
  return _.find(types, _.partial(isType, value));
};

getNameOfType = function(x) {
  switch (false) {
    case !(x == null):
      return "" + x;
    case !isString(x):
      return x;
    case !isFunction(x):
      return x.name;
    case !_.isNaN(x):
      return 'NaN';
    default:
      return x;
  }
};

green = function(x) {
  return "\x1B[32m" + x + "\x1B[39m";
};

red = function(x) {
  return "\x1B[31m" + x + "\x1B[39m";
};

clear = '\x1b[39;49;00m';

if (!(typeof process !== "undefined" && process !== null ? (ref2 = process.stdout) != null ? ref2.isTTY : void 0 : void 0)) {
  green = red = function(x) {
    return "" + x;
  };
  clear = '';
}

implodeNicely = function(list, conjunction) {
  var first, last;
  if (conjunction == null) {
    conjunction = 'and';
  }
  first = list.slice(0, -1).join(', ');
  last = list[list.length - 1];
  return first + " " + conjunction + " " + last;
};

abbreviate = function(name, value, threshold) {
  var desc, str;
  if (threshold == null) {
    threshold = 1024;
  }
  if ((str = stringify(value)).length <= threshold) {
    return str;
  }
  desc = "length: " + value.length;
  if (isArray(value)) {
    desc += "; " + str.length + " JSON encoded";
  }
  if (name) {
    name += ' ';
  }
  return "" + name + (type(value)) + "[" + desc + "]";
};

type = function(x) {
  if (isString(x)) {
    return 'String';
  }
  if (isNumber(x)) {
    return 'Number';
  }
  if (isRegExp(x)) {
    return 'RegExp';
  }
  if (isArray(x)) {
    return 'Array';
  }
  throw new TypeError("unsupported type: " + x);
};

asRegExp = function(re) {
  var flags;
  flags = '';
  if (re.global) {
    flags += 'g';
  }
  if (re.multiline) {
    flags += 'm';
  }
  if (re.ignoreCase) {
    flags += 'i';
  }
  return "/" + re.source + "/" + flags;
};

toString = Object.prototype.toString;

stringify = function(x) {
  var className, e, error1, json;
  if (x == null) {
    return "" + x;
  }
  if (_.isNaN(x)) {
    return 'NaN';
  }
  if (isRegExp(x)) {
    return asRegExp(x);
  }
  if (typeof x === 'symbol') {
    return x.toString();
  }
  json = JSON.stringify(x, function(key, val) {
    if (typeof val === 'function') {
      return toString(val);
    }
    if (isRegExp(val)) {
      return asRegExp(val);
    }
    return val;
  });
  if (typeof x !== 'object' || includes(['Object', 'Array'], className = x.constructor.name)) {
    return json;
  }
  if (x instanceof Error || /Error/.test(className)) {
    if (json === '{}') {
      return x.stack;
    }
    return x.stack + "\nwith error metadata:\n" + json;
  }
  if (x.toString === toString) {
    return className;
  }
  try {
    return className + "[" + x + "]";
  } catch (error1) {
    e = error1;
    return className;
  }
};

error = function(message, explanation) {
  if (explanation != null) {
    message = "Assertion failed: " + explanation + "\n" + clear + message;
  }
  return new Error(message);
};

handleArgs = function(self, count, args, name, help) {
  var actual, actualArgs, argc, functionSource, max, message, n, negated, wanted, wantedArgCount, wantedArgNames;
  negated = false;
  if (isString(self)) {
    negated = true;
    name = nameNegative(name);
  }
  argc = args.length;
  if (argc === count) {
    return [name, negated];
  }
  max = '';
  if (isArray(count) && indexOf.call(count, argc) >= 0) {
    n = count[count.length - 1];
    if ((argc !== n) || isString(args[0])) {
      return [name, negated];
    }
    max = ",\nand when called with " + n + " args, the first arg must be a docstring";
  }
  if (isNumber(count)) {
    wantedArgCount = count + " argument";
  } else {
    wantedArgCount = count.slice(0, -1).join(', ');
    count = count.pop();
    wantedArgCount = wantedArgCount + " or " + count + " argument";
  }
  if (count !== 1) {
    wantedArgCount += 's';
  }
  actualArgs = stringify([].slice.call(args)).slice(1, -1);
  functionSource = Function.prototype.toString.call(assert[name]);
  wantedArgNames = functionSource.match(/^function\s*[^(]*\s*\(([^)]*)/)[1];
  if (max) {
    wantedArgNames = "explanation, " + wantedArgNames;
  }
  wanted = name + "(" + wantedArgNames + ")";
  actual = name + "(" + actualArgs + ")";
  message = (green(wanted)) + " needs " + (wantedArgCount + max) + "\nyour usage: " + (red(actual));
  if (typeof help === 'function') {
    help = help();
  }
  throw error(message, help);
};

if (((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null)) {
  module.exports = assert;
} else {
  global.assert = assert;
}
