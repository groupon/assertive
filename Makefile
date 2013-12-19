default: build

BIN = node_modules/.bin
SRCDIR = src
LIBDIR = lib

SRC = $(shell find "$(SRCDIR)" -name "*.coffee" -type f | sort)
LIB = $(SRC:$(SRCDIR)/%.coffee=$(LIBDIR)/%.js)

MOCHA_ARGS = --recursive --compilers coffee:coffee-script-redux/register \
	-r coffee-script-redux/register --reporter spec --colors

MOCHA = $(BIN)/mocha
COFFEE = $(BIN)/coffee --js

.PHONY: test build

build: $(LIB)

$(LIBDIR)/%.js: $(SRCDIR)/%.coffee
	@mkdir -p "$(@D)"
	(echo '/*!' ; cat LICENSE ; echo '*/' ; $(COFFEE) <"$<") >"$@"

test: build
	$(MOCHA) $(MOCHA_ARGS)

tag:
	git tag v`coffee -e "console.log JSON.parse(require('fs').readFileSync 'package.json').version"`

assert-on-clean-master:
	@[[ "`git rev-parse --abbrev-ref HEAD`" = "master" ]] || \
		$(call ERROR,"Not on master branch")
	@git diff --exit-code --name-status || \
		$(call ERROR,"Uncommitted changes!")

release-patch: assert-on-clean-master
release-minor: assert-on-clean-master
release-major: assert-on-clean-master
release-patch: BUMP = patch
release-minor: BUMP = minor
release-major: BUMP = major
release-patch: release
release-minor: release
release-major: release

release:
	(export VERSION=`echo 'path = "./package.json"; p = require(path);' \
		'fs = require("fs"); json = require("format-json");' \
		'p.version = require("semver").inc(p.version, "'$(BUMP)'");' \
		'fs.writeFileSync(path, json.diffy(p) + "\\\\n");' \
		'console.log(p.version);' \
		| node` ; \
	git commit package.json -m "$$VERSION" && \
	git tag -m "$$VERSION" -a "v$$VERSION" && \
	git push origin "v$$VERSION")

define ERROR
	(echo '[41m[30m   '$(1)'   [39m[49m' 1>&2; false)
endef
