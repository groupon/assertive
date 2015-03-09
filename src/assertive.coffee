###
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
###

# eat _ off the global scope, or require it ourselves if missing

global = Function('return this')()
{contains, isEqual, isString, isNumber, isRegExp, isArray, isFunction, pluck} =
_ = global._ ? require 'underscore'


assert =
  truthy: (bool) ->
    [name, negated] = handleArgs this, [1, 2], arguments, 'truthy'
    [explanation, bool] = arguments  if arguments.length is 2
    unless (!!bool) ^ negated
      throw error "Expected #{red stringify bool} to be #{name}", explanation

  expect: (bool) ->
    [explanation, bool] = arguments  if arguments.length is 2
    if explanation
      assert.equal explanation, true, bool
    else
      assert.equal true, bool

  equal: (expected, actual) ->
    [name, negated] = handleArgs this, [2, 3], arguments, 'equal'
    [explanation, expected, actual] = arguments  if arguments.length is 3
    if negated
      if expected is actual
        throw error 'notEqual assertion expected ' + red(stringify actual) +
        ' to be exactly anything else', explanation
    else if expected isnt actual
      throw error """Expected: #{green stringify expected}
                     Actually: #{red stringify actual}""", explanation

  deepEqual: (expected, actual) ->
    [name, negated] = handleArgs this, [2, 3], arguments, 'deepEqual'
    [explanation, expected, actual] = arguments  if arguments.length is 3
    unless isEqual(expected, actual) ^ negated
      wrongLooks = stringify actual
      if negated
        throw error """notDeepEqual assertion expected exactly anything else but
                       #{red(wrongLooks)}""", explanation

      rightLooks = stringify expected
      message = if wrongLooks is rightLooks
        """deepEqual #{green rightLooks} failed on something that
           serializes to the same result (likely some function)"""
      else
        """Expected: #{green rightLooks}
           Actually: #{red wrongLooks}"""
      throw error message, explanation

  include: (needle, haystack) ->
    [name, negated] = handleArgs this, [2, 3], arguments, 'include'
    [explanation, needle, haystack] = arguments  if arguments.length is 3
    if isString haystack
      if needle is ''
        what = if negated then 'always-failing test' else 'no-op test'
        throw error "#{what} detected: all strings contain the empty string!"
      unless isString(needle) or isNumber(needle) or isRegExp(needle)
        problem = "needs a RegExp/String/Number needle for a String haystack"
        throw new TypeError """#{name} #{problem}; you used:
          #{name} #{green stringify haystack}, #{red stringify needle}"""
    else unless isArray haystack
      needle = stringify needle
      throw new TypeError """#{name} takes a String or Array haystack; you used:
                             #{name} #{red stringify haystack}, #{needle}"""

    if isString haystack
      if isRegExp needle
        contained = haystack.match needle
      else
        contained = haystack.indexOf(needle) isnt -1
    else
      contained = contains haystack, needle

    verb = if isRegExp needle then 'match' else 'include'
    if negated
      if contained
        message = """notInclude expected needle not to be found in haystack
                     - needle: #{stringify needle}
                     haystack: #{abbreviate '', haystack}"""
        if isString(haystack) and isRegExp(needle)
          message += ", but found:\n"
          if needle.global
            message += contained.map((s) -> "* #{red stringify s}").join '\n'
          else
            message += "* #{red stringify contained[0]}"
        throw error message, explanation
    else if not contained
      throw error """#{name} expected needle to be found in haystack
                     - needle: #{stringify needle}
                     haystack: #{abbreviate '', haystack}""", explanation

  match: (regexp, string) ->
    [name, negated] = handleArgs this, [2, 3], arguments, 'match'
    [explanation, regexp, string] = arguments  if arguments.length is 3
    unless (re = isRegExp regexp) and isString string
      string = abbreviate 'string', string
      called = "#{name} #{stringify regexp}, #{red string}"
      if not re
        oops = 'regexp arg is not a RegExp'
      else
        oops = 'string arg is not a String'
      throw new TypeError "#{name}: #{oops}; you used:\n#{called}"

    matched = regexp.test string
    if negated
      return  unless matched
      message = """Expected: #{stringify regexp}
                   not to match: #{red abbreviate 'string', string}"""
      if regexp.global
        count = string.match(regexp).length
        message += "\nMatches: #{red count}"
      throw error message, explanation
    return  if matched
    throw error """Expected: #{stringify regexp}
                   to match: #{red abbreviate 'string', string}""", explanation


  throws: (fn) ->
    [name, negated] = handleArgs this, [1, 2], arguments, 'throws'
    [explanation, fn] = arguments  if arguments.length is 2
    if typeof explanation is 'function'
      fn = explanation
      explanation = undefined
    unless typeof fn is 'function'
      throw error "#{name} expects #{green 'a function'} but got #{red fn}"

    try
      fn()
    catch err
      if negated
        throw error """Threw an exception despite #{name} assertion:
                       #{err.message}""", explanation
      return err

    return if negated
    throw error "Didn't throw an exception as expected to", explanation

  hasType: (expectedType, value) ->
    [name, negated] = handleArgs this, [2, 3], arguments, 'hasType'
    [explanation, expectedType, value] = arguments  if arguments.length is 3

    stringType = getNameOfType expectedType
    unless stringType in types
      badArg = stringify expectedType
      suggestions = implodeNicely types, 'or'
      throw new TypeError """#{name}: unknown expectedType #{badArg}; you used:
                             #{name} #{red badArg}, #{stringify value}
                             Did you mean #{suggestions}?"""

    unless stringType is getTypeName(value) ^ negated
      value = red stringify value
      toBeOrNotToBe = (if negated then 'not ' else '') + 'to be'
      message = "Expected value #{value} #{toBeOrNotToBe} of type #{stringType}"
      throw error message, explanation

nameNegative = (name) ->
  return 'falsey'  if name is 'truthy'
  'not' + name.charAt().toUpperCase() + name.slice 1

# produce negatived versions of all the common assertion functions
positiveAssertions = [
  'truthy'
  'equal'
  'deepEqual'
  'include'
  'match'
  'throws'
  'hasType'
]
for name in positiveAssertions
  assert[nameNegative name] = do (name) -> -> assert[name].apply '!', arguments

# listing the most specific types first lets us iterate in order and verify that
# the expected type was the first match
types = [
  'null'
  'Date'
  'Array'
  'String'
  'RegExp'
  'Boolean'
  'Function'
  'Object'
  'NaN'
  'Number'
  'undefined'
]

isType = (value, typeName) ->
  return _.isDate(value) and not _.isNaN(+value)  if typeName is 'Date'
  _['is' + typeName.charAt(0).toUpperCase() + typeName.slice(1)] value

# gets the name of the type that value is an incarnation of
getTypeName = (value) ->
  _.find types, isType.bind this, value

# translates any argument we were meant to interpret as a type, into its name
getNameOfType = (x) ->
  switch
    when not x?       then "#{x}" # null / undefined
    when isString x   then x
    when isFunction x then x.name
    when _.isNaN x    then 'NaN'
    else x

green = (x) -> "\x1B[32m#{ x }\x1B[39m"
red = (x) -> "\x1B[31m#{ x }\x1B[39m"
clear = "\x1b[39;49;00m"

unless process?.stdout?.isTTY
  green = red = (x) -> "#{x}"
  clear = ''

implodeNicely = (list, conjunction = 'and') ->
  first = list.slice(0, -1).join(', ')
  last = list[list.length - 1]
  "#{first} #{conjunction} #{last}"

abbreviate = (name, value, threshold = 1024) ->
  return str  if (str = stringify value).length <= threshold
  desc = "length: #{value.length}"
  desc += "; #{str.length} JSON encoded"  if isArray value
  name += ' '  if name
  "#{name}#{type value}[#{desc}]"

type = (x) ->
  return 'String' if isString x
  return 'Number' if isNumber x
  return 'RegExp' if isRegExp x
  return 'Array'  if isArray  x
  throw new TypeError "unsupported type: #{x}"

asRegExp = (re) ->
  flags = ''
  flags += 'g'  if re.global
  flags += 'm'  if re.multiline
  flags += 'i'  if re.ignoreCase
  "/#{re.source}/#{flags}"

toString = Object::toString

stringify = (x) ->
  return "#{x}"  unless x?
  return 'NaN'  if _.isNaN x
  return asRegExp x  if isRegExp x
  return x.toString()  if typeof x is 'symbol'
  json = JSON.stringify x, (key, val) ->
    return toString val  if typeof val is 'function'
    return asRegExp val  if isRegExp val
    return val
  if typeof x isnt 'object' \
  or contains ['Object', 'Array'], className = x.constructor.name
    return json

  if x instanceof Error or /Error/.test className
    return x.stack  if json is '{}'
    return "#{x.stack}\nwith error metadata:\n#{json}"
  return className  if x.toString is toString
  try
    return "#{className}[#{x}]"
  catch e
    return className

error = (message, explanation) ->
  if explanation?
    message = "Assertion failed: #{explanation}\n#{clear}#{message}"
  new Error message

# assert that the function got `count` args (if an integer), one of the number
# of args (if an array of legal counts), and if it was an array and the count
# was equal to the last option (fully populated), that the first arg is a String
# (that test's semantic explanation)
handleArgs = (self, count, args, name, help) ->
  negated = false
  if isString self
    negated = true
    name = nameNegative name

  argc = args.length
  return [name, negated]  if argc is count

  max = ''
  if isArray(count) and argc in count
    n = count[count.length - 1]
    return [name, negated]  if (argc isnt n) or isString args[0]
    max = """,
      and when called with #{n} args, the first arg must be a docstring"""

  if isNumber count
    wantedArgCount = "#{count} argument"
  else
    wantedArgCount = count.slice(0, -1).join(', ')
    count = count.pop()
    wantedArgCount = "#{wantedArgCount} or #{count} argument"
  wantedArgCount += 's' unless count is 1

  actualArgs = stringify([].slice.call args).slice 1, -1

  functionSource = Function::toString.call assert[name]
  wantedArgNames = functionSource.match(/^function\s*[^(]*\s*\(([^)]*)/)[1]
  wantedArgNames = "explanation, #{wantedArgNames}"  if max

  wanted = "#{name}(#{wantedArgNames})"
  actual = "#{name}(#{actualArgs})"
  message = """#{green wanted} needs #{wantedArgCount + max}
    your usage: #{red actual}"""

  help = help()  if typeof help is 'function'
  throw error message, help

# export as a module to node - or to the global scope, if not
if (module?.exports?)
  module.exports = assert
else
  global.assert = assert
