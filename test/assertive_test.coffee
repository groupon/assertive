{ truthy,    falsey
, expect,    notExpect
, equal,     notEqual
, deepEqual, notDeepEqual
, include,   notInclude
, match,     notMatch
, throws,    notThrows } = require '../lib/assertive'

describe 'throws', ->
  it 'errors out when you provide too few or too many args', ->
    throws -> throws()
    throws -> throws(1, 2, 3)

  it 'notes that arg 1 must be a string when called with 2 args', ->
    err = throws -> throws 1, 'description in wrong arg'
    include 'called with 2 args, the first arg must be a docstring', err.message

  it 'errors out unless you pass a function to execute', ->
    throws -> throws(68000)
    throws -> throws('more awesomeness', 68020)

  it "returns the exception that was thrown by the provided function", ->
    exception = new Error 68040
    equal throws(-> throw exception), exception
    equal throws(-> throw 'we suck'), 'we suck'

  it 'includes your helpful explanation, when provided', ->
    explanation = 'No error was thrown - this is a problem'
    err = throws -> throws explanation, ->
    include explanation, err.message


describe 'notThrows', ->
  it 'errors out when you provide too few or too many args', ->
    throws -> notThrows()
    throws -> notThrows(1, 2, 3)

  it 'notes that arg 1 must be a string when called with 2 args', ->
    err = throws -> notThrows 1, 'description in wrong arg'
    include 'called with 2 args, the first arg must be a docstring', err.message

  it 'errors out unless you pass a function to execute', ->
    throws -> notThrows(68000)
    throws -> notThrows('more awesomeness', 68020)

  it "captures and shows exceptions thrown by the provided function", ->
    thrown = new Error 68040
    caught = throws -> notThrows -> throw thrown
    truthy 'the exception thrown was caught and a new exception thrown', caught
    include 'Threw an exception despite notThrows assertion:', caught.message
    include 'assertion:\n68040', caught.message

  it 'includes your helpful explanation, when provided', ->
    explanation = 'No error was thrown - this is a problem'
    err = throws -> notThrows explanation, -> throw new Error 'aiee!'
    include explanation, err.message


truthyOutcome = (fn, outcome) ->
  ->
    outcome -> fn 1
    outcome -> fn {}
    outcome -> fn []
    outcome -> fn '!'
    outcome -> fn true

falseyOutcome = (fn, outcome) ->
  ->
    outcome -> fn 0
    outcome -> fn ''
    outcome -> fn null
    outcome -> fn false
    outcome -> fn undefined

truthyIsNoOp = (fn) -> truthyOutcome fn, notThrows
falseyIsNoOp = (fn) -> falseyOutcome fn, notThrows
truthyThrows = (fn) -> truthyOutcome fn, throws
falseyThrows = (fn) -> falseyOutcome fn, throws

describe 'truthy', ->
  it 'errors out when you provide too few or too many args', ->
    throws -> truthy()
    throws -> truthy('description', true, 3)

  it 'notes that arg 1 must be a string when called with 2 args', ->
    err = throws -> truthy true, 'description in wrong arg'
    include 'called with 2 args, the first arg must be a docstring', err.message

  it "doesn't do anything when passed a truthy value", -> truthyIsNoOp truthy

  it 'errors out when passed a falsey value', falseyThrows truthy

  it 'includes your helpful explanation, when provided', ->
    explanation = 'Given falsum, we can derive anything, which is awesome!'
    err = throws -> truthy explanation, false
    include explanation, err.message


describe 'falsey', ->
  it 'errors out when you provide too few or too many args', ->
    throws -> falsey()
    throws -> falsey('description', false, 3)

  it 'notes that arg 1 must be a string when called with 2 args', ->
    err = throws -> falsey false, 'description in wrong arg'
    include 'called with 2 args, the first arg must be a docstring', err.message

  it "doesn't do anything when passed a falsey value", falseyIsNoOp falsey

  it 'errors out when passed a truthy value', truthyThrows falsey

  it 'includes your helpful explanation, when provided', ->
    explanation = 'falsey will confidently reject all your truths'
    err = throws -> falsey explanation, true
    include explanation, err.message


describe 'expect', ->
  it 'errors out when you provide too few or way too many args', ->
    throws -> expect()
    throws -> expect('description illegal to protect the sloppy; use truthy', 1)

  it "doesn't do anything when passed a truthy value", truthyIsNoOp expect

  it 'errors out when passed a non-truthy value', falseyThrows expect

  it 'helps you pick the right function for the job when given two args', ->
    err = throws -> expect 'te' + 'st', 'test' # people try this kind of stuff
    include 'Error message suggests using truthy',    'truthy',    err.message
    include 'Error message suggests using equal',     'equal',     err.message
    include 'Error message suggests using deepEqual', 'deepEqual', err.message
    include 'Error message suggests using include',   'include',   err.message


describe 'equal', ->
  it 'errors out when you provide too few or too many args', ->
    throws -> equal()
    throws -> equal(1)
    throws -> equal('description', 1, 1, 4)

  it 'notes that arg 1 must be a string when called with 3 args', ->
    err = throws -> equal 1, 1, 'description in wrong arg'
    include 'called with 3 args, the first arg must be a docstring', err.message

  it "doesn't do anything when passed two identical values", ->
    equal 1, 1
    equal this, this
    equal null, null
    equal undefined, undefined

  it 'errors out when passed two non-identical values', ->
    throws -> equal 0, 1
    throws -> equal {}, {}
    throws -> equal null, undefined
    throws -> equal false, 0
    throws -> equal [], []

  it 'includes your helpful explanation, when provided', ->
    explanation = 'Given falsum, we can derive anything, which is awesome!'
    err = throws -> equal explanation, 0, 1
    include explanation, err.message


describe 'notEqual', ->
  it 'errors out when you provide too few or too many args', ->
    throws -> notEqual()
    throws -> notEqual(1)
    throws -> notEqual('description', 1, 2, 4)

  it 'notes that arg 1 must be a string when called with 3 args', ->
    err = throws -> notEqual 1, 2, 'description in wrong arg'
    include 'called with 3 args, the first arg must be a docstring', err.message

  it "doesn't do anything when passed two different values", ->
    notEqual 1, 2
    notEqual this, Object.create this
    notEqual NaN, NaN
    notEqual null, undefined

  it 'errors out when passed two identical values', ->
    throws -> notEqual 0, 0
    throws -> notEqual this, this
    throws -> notEqual null, null
    throws -> notEqual (x = []), x
    throws -> notEqual undefined, undefined
    throws -> notEqual false, false
    throws -> notEqual true, true

  it 'includes your helpful explanation, when provided', ->
    explanation = "it doesn't get more equal than identical"
    err = throws -> notEqual explanation, Math.PI, Math.PI
    include explanation, err.message


describe 'deepEqual', ->
  it 'errors out when you provide too few or too many args', ->
    throws -> deepEqual()
    throws -> deepEqual(1)
    throws -> deepEqual('description', 1, 1, 4)

  it 'notes that arg 1 must be a string when called with 3 args', ->
    err = throws -> deepEqual 1, 1, 'description in wrong arg'
    include 'called with 3 args, the first arg must be a docstring', err.message

  it "doesn't do anything when passed two deepEqual values", ->
    deepEqual 1, 1
    deepEqual this, this
    deepEqual null, null
    deepEqual undefined, undefined
    deepEqual [1], [1]
    deepEqual { a: this }, { a: this }
    deepEqual [null], [null]
    deepEqual { u: undefined }, { u: undefined }

  it 'errors out when passed two non-deepEqual values', ->
    throws -> deepEqual {}, []
    throws -> deepEqual 0, 1
    throws -> deepEqual null, undefined
    throws -> deepEqual false, 0
    throws -> deepEqual [1], [2]
    throws -> deepEqual { a: {} }, { a: [] }
    throws -> deepEqual [null], [undefined]
    throws -> deepEqual {}, { u: undefined }

  it 'includes your helpful explanation, when provided', ->
    explanation = 'Given falsum, we can derive anything, which is awesome!'
    err = throws -> deepEqual explanation, [null], [undefined]
    include explanation, err.message


describe 'notDeepEqual', ->
  it 'errors out when you provide too few or too many args', ->
    throws -> notDeepEqual()
    throws -> notDeepEqual(1)
    throws -> notDeepEqual('description', 1, 2, 4)

  it 'notes that arg 1 must be a string when called with 3 args', ->
    err = throws -> notDeepEqual 1, 2, 'description in wrong arg'
    include 'called with 3 args, the first arg must be a docstring', err.message

  it "doesn't do anything when passed two not deepEqual values", ->
    notDeepEqual 1, 2
    notDeepEqual 2, []
    notDeepEqual this, {}
    notDeepEqual null, undefined
    notDeepEqual String, Number
    notDeepEqual [1], [2]
    notDeepEqual { a: this }, { b: this }
    notDeepEqual [null], [undefined]
    notDeepEqual {}, { u: undefined }

  it 'errors out when passed two deepEqual values', ->
    throws -> notDeepEqual {}, {}
    throws -> notDeepEqual 0, 0
    throws -> notDeepEqual null, null
    throws -> notDeepEqual false, false
    throws -> notDeepEqual [1], [1]
    throws -> notDeepEqual { a: {} }, { a: {} }
    throws -> notDeepEqual [null], [null]
    throws -> notDeepEqual [[{}]], [[{}]]

  it 'includes your helpful explanation, when provided', ->
    explanation = 'Given falsum, we can derive anything, which is awesome!'
    err = throws -> notDeepEqual explanation, [null], [null]
    include explanation, err.message


describe 'include', ->
  it 'errors out when you provide too few or too many args', ->
    throws -> include()
    throws -> include([1])
    throws -> include('description', 1, [1], 4)

  it 'notes that arg 1 must be a string when called with 3 args', ->
    err = throws -> include 1, [1], 'description in wrong arg'
    include 'called with 3 args, the first arg must be a docstring', err.message

  it 'throws TypeErrors on bad needles', ->
    saneNeedlesPlease = /needs a .* needle for a String haystack/
    e = throws -> include undefined, 'undefined? baad'
    match saneNeedlesPlease, e.message
    e = throws -> include(->, 'function? worse')
    match saneNeedlesPlease, e.message
    truthy 'should throw TypeError', e instanceof TypeError

  it 'raises a helpful TypeError when you pass a bad haystack', ->
    err = throws -> include 0, 1000
    include 'include takes a String or Array haystack', err.message
    truthy 'include throws a TypeError on bad args', err instanceof TypeError

  describe 'errors out extra helpfully when you provide an empty haystack', ->
    it 'as an array', ->
      err = throws -> include 'Your expectations are problematic, dear', []
      expectedError = 'include expected needle to be found in haystack\n- needle: \"Your expectations are problematic, dear\"\nhaystack: []'
      include expectedError, err.message

    it 'as a string', ->
      err = throws -> include 'Adjust your code and try again, love', ''
      expectedError = 'include expected needle to be found in haystack\n- needle: \"Adjust your code and try again, love\"\nhaystack: \"\"'
      include expectedError, err.message

  it "doesn't do anything when passed an array including the value", ->
    include 1, [1]
    include this, [1, this, 3]
    include null, [null, 2]
    include undefined, [1, undefined]

  it "doesn't do anything when passed a string including the value", ->
    include 'ho', 'hey ho'
    include 'ho', 'hoopla'
    include 'ho', 'what ho, Jeeves?'

  it "doesn't do anything when passed a string matching the RegExp", ->
    include /h[oe]/, 'hey ho'
    include /^ho+pla$/, 'hoopla'
    include /jeeves/i, 'what ho, Jeeves?'
    include /^$/, ''

  it "errors out when the string passed doesn't include the needle", ->
    throws -> include '/spelunking/', 'spelunking'
    throws -> include 'SAY, WHAT?', 'say, what?'

  it "errors out when the string passed doesn't match the RegExp", ->
    throws -> include /SPELUNKING/, 'spelunking'
    throws -> include /SAY, WHAT$/i, 'say, what?'

  it "errors out when the array passed doesn't include the value", ->
    throws -> include [], [{}]
    throws -> include 1, [0]
    throws -> include undefined, [null]
    throws -> include null, [undefined]

  it 'includes your helpful explanation, when provided', ->
    explanation = 'Given falsum, we can derive anything, which is awesome!'
    err = throws -> include explanation, [undefined], [null]
    include explanation, err.message

  it 'shortens larger haystacks in the assertion message', ->
    err = throws -> include 2001, [1..2000]
    match /^include [\s\S]*haystack: Array\[length: 2000; \d* JSON/, err.message


describe 'notInclude', ->
  it 'errors out when you provide too few or too many args', ->
    throws -> notInclude()
    throws -> notInclude(2)
    throws -> notInclude('description', 2, [1], 4)

  it 'notes that arg 1 must be a string when called with 3 args', ->
    e = throws -> notInclude 2, [1], 'description in wrong arg'
    include 'called with 3 args, the first arg must be a docstring', e.message

  it 'throws TypeErrors on bad needles', ->
    saneNeedlesPlease = /needs a .* needle for a String haystack/
    e = throws -> notInclude undefined, 'undefined? baad'
    match saneNeedlesPlease, e.message
    e = throws -> notInclude ->, 'function? worse'
    match saneNeedlesPlease, e.message
    truthy 'should throw TypeError', e instanceof TypeError

  it 'raises a helpful TypeError when you pass a bad haystack', ->
    e = throws -> notInclude 0, 1000
    include 'notInclude takes a String or Array haystack', e.message
    truthy 'notInclude throws a TypeError on bad args', e instanceof TypeError

  it 'lets you pass an empty haystack if you want to', ->
    notThrows -> notInclude 'Your expectations are just fine, love', []

  it "doesn't do anything when passed an array not including the value", ->
    notInclude 2, [1]
    notInclude Object.create(this), [1, this, 3]
    notInclude 1, [null, 2]
    notInclude null, [1, undefined]

  it "errors out when passed a string including the value", ->
    throws -> notInclude 'ho', 'hey ho'
    throws -> notInclude 'ho', 'hoopla'
    throws -> notInclude 'ho', 'what ho, Jeeves?'

  it "errors out when passed a string matching the RegExp", ->
    throws -> notInclude /h[oe]/, 'hey ho'
    throws -> notInclude /^ho+pla$/, 'hoopla'
    throws -> notInclude /jeeves/i, 'what ho, Jeeves?'

  it "doesn't do anything when the string passed doesn't include the needle", ->
    notInclude '/spelunking/', 'spelunking'
    notInclude 'SAY, WHAT?', 'say, what?'

  it "doesn't do anything when the string passed doesn't match the RegExp", ->
    notInclude /SPELUNKING/, 'spelunking'
    notInclude /SAY, WHAT$/i, 'say, what?'

  it "errors out when the array passed does include the value", ->
    throws -> notInclude 0, [0]
    throws -> notInclude this, [this]
    throws -> notInclude null, [null]
    throws -> notInclude undefined, [undefined]

  it 'includes your helpful explanation, when provided', ->
    explanation = 'Given falsum, we can derive anything, which is awesome!'
    err = throws -> notInclude explanation, null, [null]
    include explanation, err.message

  it 'shortens larger haystacks in the assertion message', ->
    err = throws -> notInclude 2000, [1..2000]
    match /notInclude[\s\S]*stack: Array\[length: 2000; \d* JSON/, err.message


describe 'match', ->
  it 'errors out when you provide too few or too many args', ->
    throws -> match()
    throws -> match(/foo/)
    throws -> match('description', /foo/, 'foo', 'bar')

  it 'notes that arg 1 must be a string when called with 3 args', ->
    e = throws -> match /foo/, 'foo', 'description in wrong arg'
    include 'called with 3 args, the first arg must be a docstring', e.message

  it 'throws TypeErrors when called with a non-RegExp', ->
    e = throws -> match 'foo', 'foobar'
    match /regexp arg is not a RegExp; you used:\nmatch .*"foo"/, e.message
    truthy 'should throw TypeError', e instanceof TypeError

  it 'throws TypeErrors when called with a non-String', ->
    e = throws -> match /X/, undefined
    match /string arg is not a String; you used:\nmatch .*X.*undefin/, e.message
    truthy 'should throw TypeError', e instanceof TypeError

  it "doesn't do anything when passed a RegExp that the string matches", ->
    match /^fo*/i, 'FOOBAR'

  it "doesn't break when also passed a docstring", ->
    match 'still fine and dandy', /^fo*/i, 'FOOBAR'

  it "errors out when the RegExp does not match the passed string", ->
    e = throws -> match /wrong case/, 'WRONG CASE'
    match /Expected: \/wrong case\/\nto match: .*"WRONG CASE"/, e.message

  it 'includes your helpful explanation, when provided', ->
    explanation = 'Given falsum, we can derive anything, which is awesome!'
    e = throws -> match explanation, /aye/, 'nay'
    include explanation, e.message

  it 'shortens larger strings in the assertion message', ->
    e = throws -> match /4711/, JSON.stringify [1..2000]
    include 'string String[length: 8894]', e.message


describe 'notMatch', ->
  it 'errors out when you provide too few or too many args', ->
    throws -> notMatch()
    throws -> notMatch(/foo/)
    throws -> notMatch('description', /foo/, 'foo', 'bar')

  it 'notes that arg 1 must be a string when called with 3 args', ->
    e = throws -> notMatch /foo/, 'foo', 'description in wrong arg'
    include 'called with 3 args, the first arg must be a docstring', e.message

  it 'throws TypeErrors when called with a non-RegExp', ->
    e = throws -> notMatch 'bar', 'barfoo'
    match /regexp arg is not a RegExp; you used:\nnotMatch .*"bar"/, e.message
    truthy 'should throw TypeError', e instanceof TypeError

  it 'throws TypeErrors when called with a non-String', ->
    e = throws -> notMatch /x/, undefined
    match /string arg is not a String; you used:\nnotMatch.*undefine/, e.message
    truthy 'should throw TypeError', e instanceof TypeError

  it "doesn't do anything when passed a RegExp not matching the string", ->
    notMatch /^not/, 'FOOBAR'

  it "doesn't break when also passed a docstring", ->
    notMatch 'still fine and dandy', /^not/, 'FOOBAR'

  it "errors out when the RegExp matches the passed string", ->
    e = throws -> notMatch /problem/i, 'Problems found!'
    match /Expected: \/problem\/i\nnot to match: .*"Problems found!"/, e.message

  it "shows how many matches we did find when passed a global RegExp", ->
    e = throws -> notMatch /yo+/gi, 'Yo, yo, yo, yooo, man!'
    match /Matches: .*4\b/, e.message

  it 'includes your helpful explanation, when provided', ->
    explanation = 'Given falsum, we can derive anything, which is awesome!'
    e = throws -> notMatch explanation, /woo/, 'woo!'
    include explanation, e.message

  it 'shortens larger strings in the assertion message', ->
    e = throws -> notMatch /200/, JSON.stringify [1..2000]
    include 'string String[length: 8894]', e.message
