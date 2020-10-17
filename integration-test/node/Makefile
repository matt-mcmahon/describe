DENO_DIR := ../../${DENO_DIR}

all: install test

build:

clean:
	rm -rf node_modules

install:

node_modules/@mwm/describe:
	${NPM_LINK} @mwm/describe

test: node_modules/@mwm/describe
	deno test --allow-run ${CACHE_OPTIONS} .

.PHONY: all build clean install link test unlink
