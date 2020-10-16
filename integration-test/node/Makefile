DENO_DIR := ../../${DENO_DIR}

all: clean install test

build:

install:
	${NPM_LINK} @mwm/describe

clean:
	rm -rf node_modules $(NPM_PACKAGE_LOCK)

test: install
	deno test --allow-run ${CACHE_OPTIONS} .

.PHONY: all build install clean test
