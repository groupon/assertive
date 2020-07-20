### 5.0.2 - 2020-07-20

* chore(deps): bump acorn from 7.1.0 to 7.1.1 - **[@dependabot[bot]](https://github.com/apps/dependabot)** [#52](https://github.com/groupon/assertive/pull/52)
  - [`e7dd142`](https://github.com/groupon/assertive/commit/e7dd14245e260e30207c2d1621845123783b888a) **chore:** bump acorn from 7.1.0 to 7.1.1 - see: [7](- [Commits](https://github.com/acornjs/acorn/compare/7)
* chore(deps): bump lodash from 4.17.15 to 4.17.19 - **[@dependabot[bot]](https://github.com/apps/dependabot)** [#54](https://github.com/groupon/assertive/pull/54)
  - [`3b557b9`](https://github.com/groupon/assertive/commit/3b557b98b7e03b307b8201f2cd191f4f0d6c1368) **chore:** bump lodash from 4.17.15 to 4.17.19 - see: [4](- [Commits](https://github.com/lodash/lodash/compare/4)


### 5.0.1 - 2020-05-06

* fix: class detection - **[@aaarichter](https://github.com/aaarichter)** [#53](https://github.com/groupon/assertive/pull/53)
  - [`bfc623f`](https://github.com/groupon/assertive/commit/bfc623f046dfc903cadaca387b4f213a94e89734) **fix:** class detection
  - [`efc60cd`](https://github.com/groupon/assertive/commit/efc60cd30d7c0ba680147e51003d85dfccc0b2d0) **chore:** update dependencies & lint code


### 5.0.0

#### Breaking Changes

`hasType(Function, ...)` no longer throws on async and generator functions

*See: [`980208c`](https://github.com/groupon/assertive/commit/980208c158992da978353b7de7c088da4a1156a1)*

#### Commits

* feat: add new types to hasType - **[@aaarichter](https://github.com/aaarichter)** [#51](https://github.com/groupon/assertive/pull/51)
  - [`980208c`](https://github.com/groupon/assertive/commit/980208c158992da978353b7de7c088da4a1156a1) **feat:** add new types to hasType


### 4.0.0

#### Breaking Changes

- drop Node 6 & 8 support

*See: [`3abdb53`](https://github.com/groupon/assertive/commit/3abdb53fd0898ec28b06e938f760a482b75de88c)*

With the source code migrated to ES6, usage in client tests with testemJS & PhantomJS or other ES5 browser are no longer supported.

*See: [`62dfd69`](https://github.com/groupon/assertive/commit/62dfd6903a2a922f99a2daa7c4c7f1f19b74be90)*

#### Commits

* refactor: drop Node 6/8 support; convert to ES6 & upgrade packages - **[@aaarichter](https://github.com/aaarichter)** [#49](https://github.com/groupon/assertive/pull/49)
  - [`d6a3df2`](https://github.com/groupon/assertive/commit/d6a3df2d06546fb9f95ae9fbbaf1dd88c42b1355) **fix:** npm audit fix
  - [`3abdb53`](https://github.com/groupon/assertive/commit/3abdb53fd0898ec28b06e938f760a482b75de88c) **refactor:** drop Node 6 & 8 support & upgrade dependencies
  - [`ea67d42`](https://github.com/groupon/assertive/commit/ea67d42300e085fdee88639f52f1bf3d0b369c8d) **style:** eslint & remove local eslintrc
  - [`62dfd69`](https://github.com/groupon/assertive/commit/62dfd6903a2a922f99a2daa7c4c7f1f19b74be90) **refactor:** remove babel transpilation
  - [`c79a0d0`](https://github.com/groupon/assertive/commit/c79a0d06a43ab2810646d1a0010eaa7236062090) **refactor:** remove bluebird


### 3.1.0

* typedefs - **[@dbushong](https://github.com/dbushong)** [#45](https://github.com/groupon/assertive/pull/45)
  - [`6f0920f`](https://github.com/groupon/assertive/commit/6f0920f2831ec76e043902436edce988943a85ba) **chore:** upgrade nlm for proper lock version bumping
  - [`94f4718`](https://github.com/groupon/assertive/commit/94f471844be70dded32d31fb31b610c6046dd32a) **chore:** audit fixes
  - [`a58b6b8`](https://github.com/groupon/assertive/commit/a58b6b8fe4abbc4de4d05262541c418f80ae1767) **feat:** add type definitions


### 3.0.1

* Fix audited packages, support Node 10, drop support for Node 4 - **[@markowsiak](https://github.com/markowsiak)** [#44](https://github.com/groupon/assertive/pull/44)
  - [`0ef5fe1`](https://github.com/groupon/assertive/commit/0ef5fe195a77ab3ae4ee581425a07e752b976b9a) **chore:** package updates to fix audit
  - [`71eacfb`](https://github.com/groupon/assertive/commit/71eacfb2f5046de598ec6551271b3826fd2ffe11) **chore:** support node 10, drop node 4
  - [`87c62fc`](https://github.com/groupon/assertive/commit/87c62fc72acc0ebe249dc54cea9d10f7e0947b7d) **chore:** use npm6 during build


### 3.0.0

#### Breaking Changes

no longer works without SOME CommonJS compatibility (e.g. node, browserify)

*See: [`58884fe`](https://github.com/groupon/assertive/commit/58884feb9912ad40b32adac84923b85ceb6c7716)*

#### Commits

* no longer depend/break on global `_` - **[@dbushong](https://github.com/dbushong)** [#43](https://github.com/groupon/assertive/pull/43)
  - [`58884fe`](https://github.com/groupon/assertive/commit/58884feb9912ad40b32adac84923b85ceb6c7716) **feat:** no longer depend/break on global `_`


### 2.4.1

* Apply latest generator - **[@markowsiak](https://github.com/markowsiak)** [#41](https://github.com/groupon/assertive/pull/41)
  - [`8a01540`](https://github.com/groupon/assertive/commit/8a01540c8722b30f3dbf3b996667cdda9b89f49d) **chore:** Apply latest generator


### 2.4.0

* stop diffing internally; lean on mocha - **[@dbushong](https://github.com/dbushong)** [#40](https://github.com/groupon/assertive/pull/40)
  - [`74beefa`](https://github.com/groupon/assertive/commit/74beefae671795e09bae68c107114456fd3b14a3) **feat:** stop diffing internally; lean on mocha


### 2.3.5

* apply latest generator & lint rules - **[@dbushong](https://github.com/dbushong)** [#39](https://github.com/groupon/assertive/pull/39)
  - [`edafdef`](https://github.com/groupon/assertive/commit/edafdefe3db0eadee5566d09ce22eb0fc3d9cad8) **chore:** apply latest generator & lint rules


### 2.3.4

* fix: correct isTTY logic for colorization - **[@dbushong](https://github.com/dbushong)** [#37](https://github.com/groupon/assertive/pull/37)
  - [`1860ca3`](https://github.com/groupon/assertive/commit/1860ca3402fb8960ec037fdadcd57fb2ef9dfc0c) **fix:** correct isTTY logic for colorization


### 2.3.3

* fix: don't try to require('diff') for browsers - **[@dbushong](https://github.com/dbushong)** [#34](https://github.com/groupon/assertive/pull/34)
  - [`bf8e03a`](https://github.com/groupon/assertive/commit/bf8e03a22da8f584df54f07264f96eaedc0418fb) **fix:** don't try to require('diff') for browsers


### 2.3.2

* chore: minor package and ci run cleanup - **[@dbushong](https://github.com/dbushong)** [#32](https://github.com/groupon/assertive/pull/32)
  - [`d92b979`](https://github.com/groupon/assertive/commit/d92b979dfb75f79d05473707b1e1bdce3b613958) **chore:** minor package and ci run cleanup


### 2.3.1

* chore: compile with babel for browser-compat - **[@dbushong](https://github.com/dbushong)** [#31](https://github.com/groupon/assertive/pull/31)
  - [`b2909e8`](https://github.com/groupon/assertive/commit/b2909e8548006e0fb62ade6b43d6c342ebab9282) **chore:** compile with babel for browser-compat


### 2.3.0

* feat: show object diffs in deepEqual errors - **[@dbushong](https://github.com/dbushong)** [#30](https://github.com/groupon/assertive/pull/30)
  - [`d8065c1`](https://github.com/groupon/assertive/commit/d8065c17d110778d4e31b8eef146083a1add1263) **feat:** show object diffs in deepEqual errors


### 2.2.1

* refactor: get rid of coffeescript - **[@dbushong](https://github.com/dbushong)** [#29](https://github.com/groupon/assertive/pull/29)
  - [`bf88f28`](https://github.com/groupon/assertive/commit/bf88f284dbc11756213803be67033c5d3a4ded24) **refactor:** get rid of coffeescript
  - [`76bc3d0`](https://github.com/groupon/assertive/commit/76bc3d050a0cc8e50494726b360c8bac6f1aab04) **test:** test on node v4 & 6
  - [`2f1e063`](https://github.com/groupon/assertive/commit/2f1e063ce1c60c5579e178a2b71c1bd7c5815bbc) **chore:** misc. cleanup


### 2.2.0

* better JSON Expected/Actual output in Errors - **[@dbushong](https://github.com/dbushong)** [#28](https://github.com/groupon/assertive/pull/28)
  - [`25d8d5f`](https://github.com/groupon/assertive/commit/25d8d5f3115a753e26b92979160e7280f1137d00) **chore:** upgrade pkg deps
  - [`dc15426`](https://github.com/groupon/assertive/commit/dc15426a44cc91e5c70b4417764ca1e955e71c1a) **feat:** better JSON Expected/Actual output
  - [`177b881`](https://github.com/groupon/assertive/commit/177b88178f2194ea368ea9075e2ac2ddd1e94a08) **test:** add tests for prettyprinted JSON


### 2.1.1

* chore: fix who travis credits for auto-commits - **[@dbushong](https://github.com/dbushong)** [#27](https://github.com/groupon/assertive/pull/27)
  - [`0ff64b5`](https://github.com/groupon/assertive/commit/0ff64b53cdbdcbe82fe6cf5df21a0255305c0300) **chore:** fix who travis credits for auto-commits


### 2.1.0

* feat: integrate assertive-as-promised functionality - **[@dbushong](https://github.com/dbushong)** [#26](https://github.com/groupon/assertive/pull/26)
  - [`c9be116`](https://github.com/groupon/assertive/commit/c9be1165235696c773b50b0b80e15ec6bb143633) **feat:** integrate assertive-as-promised functionality


### 2.0.3

* Apply latest nlm generator - **[@i-tier-bot](https://github.com/i-tier-bot)** [#25](https://github.com/groupon/assertive/pull/25)
  - [`1eb5321`](https://github.com/groupon/assertive/commit/1eb5321691d6ca51287ded93d1ac00bee5037baa) **chore:** Apply latest nlm generator
  - [`e4939c3`](https://github.com/groupon/assertive/commit/e4939c385b9ca79c0476918b43ae0c917e929004) **fix:** Use lodash 4 method names


2.0.2
-----
* Change Fn.bind to _.partial to support non-ES5 environments - @rduenasf #23

2.0.1
-----
* add coffeelint & npub - @chkhoo #22
* replace underscore & redux with lodash & coffee-script - @chkhoo #21
