'use strict';

// test the auto-promise-awarified versions of common tests

const Bluebird = require('bluebird');
const assert = require('../');
const _ = require('lodash');

const syncFuncs = {
  truthy: {
    pass: {
      args: [true],
      descr: 'a truthy promise resolution',
    },
    fail: {
      args: [false],
      descr: 'a falsey promise resolution',
      explain: 'resolves to true',
    },
  },

  equal: {
    pass: {
      args: [5, 5],
      descr: 'an equal promise resolution',
    },
    fail: {
      args: [5, 6],
      descr: 'an inequal promise resolution',
      explain: '5 is 5',
    },
  },

  deepEqual: {
    pass: {
      args: [['a', 'b'], ['a', 'b']],
      descr: 'a deep equal promise resolution',
    },
    fail: {
      args: [['a', 'b'], 'x'],
      descr: 'a deep inequal promise resolution',
      explain: 'a,b is a,b',
    },
  },

  include: {
    pass: {
      args: ['x', 'fox'],
      descr: 'needle inclusion in haystack promise resolution',
    },
    fail: {
      args: ['x', 'dog'],
      descr: 'needle exclusion from haystack promise resolution',
      explain: 'x in word',
    },
  },

  match: {
    pass: {
      args: [/x/, 'fox'],
      descr: 'match /x/',
    },
    fail: {
      args: [/x/, 'dog'],
      descr: 'needle exclusion from haystack promise resolution',
      explain: '/x/ matches word',
    },
  },

  throws: {
    pass: {
      // eslint-disable-next-line no-throw-literal
      args: [
        () => {
          throw 'foo';
        },
      ],
      descr: 'a promise for an excepting function',
    },
    fail: {
      args: [() => 'foo'],
      descr: 'a promise for a non-excepting function',
      explain: 'function throws an exception',
    },
  },

  notThrows: {
    pass: {
      args: [() => 42],
      descr: 'a non-excepting function',
    },
    fail: {
      // eslint-disable-next-line no-throw-literal
      args: [
        () => {
          throw 'foo';
        },
      ],
      descr: 'a promise for an excepting function',
      explain: 'function does not throw an exception',
    },
  },

  hasType: {
    pass: {
      args: [Boolean, true],
      descr: 'matched type on promise resolution',
    },
    fail: {
      args: [Boolean, 'true'],
      descr: 'mismatched type on promise resolution',
      explain: 'result is a boolean',
    },
  },
};

describe('promise-aware functionality', () => {
  _.forEach(syncFuncs, (bits, name) => {
    const pass = bits.pass;
    const fail = bits.fail;

    ['pass', 'fail'].forEach(pf => {
      // replace last argument with promised resolution of same
      const args = bits[pf].args;
      bits[pf].pargs = args
        .slice(0, args.length - 1)
        .concat([Bluebird.resolve(args[args.length - 1])]);
    });

    describe(name, () => {
      it('returns a promise when passed a promise', () => {
        assert.expect(
          assert[name].apply(null, pass.pargs || []) instanceof Bluebird
        );
      });

      it('does not return a promise when not passed one', () => {
        assert.expect(
          !(assert[name].apply(null, pass.args || []) instanceof Bluebird)
        );
      });

      it(`resolves for ${pass.descr}`, () =>
        assert.resolves(
          `${name} should succeed`,
          assert[name].apply(null, pass.pargs || [])
        ));

      return it(`rejects for ${fail.descr}`, () =>
        assert
          .rejects(
            `${name} should throw`,
            assert[name].apply(null, [fail.explain].concat(fail.pargs))
          )
          .then(err => assert.include(fail.explain, err.message)));
    });
  });
});
