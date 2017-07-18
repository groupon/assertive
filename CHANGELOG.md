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
