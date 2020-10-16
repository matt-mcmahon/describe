all: clean install build test

build: build-production

build-development:
	rm -rf ./build
	${NPM_RUN} build-development

build-production:
	rm -rf ./dist
	${NPM_RUN} build-production

clean:
	rm -rf ./node_modules ./build ./.nyc_output
	-$(NPM_UNLINK)

install:
	${NPM_INSTALL}
	${NPM_LINK}

test: build-development 
	${NPM_RUN} test

.PHONY: all build build-development build-production clean install test
