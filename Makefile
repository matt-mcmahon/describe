# Include, then immediately export, environment variables in .env file.
# These variables will be available to the Deno CLI.
include .env
export

# These settings can be safely disabled by setting the VARIABLE_NAME to nothing
# in your deployment's .env file. For example, setting the following would
# disable the local Deno cache in favor of Deno's global cache:
#
# DENO_DIR=
#
CACHE_OPTIONS          ?= --cached-only
DENO_DIR               ?= .deno
IMPORT_MAP_FILE        ?= import-map.json
USE_UNSTABLE           ?=
LOCK_FILE              ?= lock-file.json
RUN_PERMISSIONS        ?=
TEST_PERMISSIONS       ?= --allow-read=./source,. --allow-run

# The default values for these settings are meant to be easily overwritten by
# your project's .env file.
#
# Do NOT set these values to nothing.
#
DENO_BUNDLE_FILE       ?= ./bundle.js
DENO_DEPENDENCIES_FILE ?= ./dependencies.ts
DENO_MAIN              ?= ./module.ts
DENO_SOURCE_DIR        ?= ./source
DENO_APP_DIR           ?= ${DENO_SOURCE_DIR}/app
DENO_LIB_DIR           ?= ${DENO_SOURCE_DIR}/lib

NODE_DIR               ?= ./target/node
NODE_GEN_DIR           ?= ${NODE_DIR}/source/gen

NPM                    ?= npm
NPM_INSTALL            ?= ${NPM} install
NPM_RUN                ?= ${NPM} run
NPM_LINK               ?= ${NPM} link

LINT_FILES             := ${shell find "${DENO_SOURCE_DIR}" -type f -name "*.ts" -not -name "*.test.ts"}

ifneq (${IMPORT_MAP_FILE},)
IMPORT_MAP_OPTIONS     := --importmap ${IMPORT_MAP_FILE}
USE_UNSTABLE           := --unstable
endif

ifneq (${LOCK_FILE},)
LOCK_OPTIONS           := --lock ${LOCK_FILE}
LOCK_OPTIONS_WRITE     := --lock ${LOCK_FILE} --lock-write
endif

all: clean install lint test build node-build node-test $(INTEGRATION_TESTS)

${LOCK_FILE}:
	@echo "File ${LOCK_FILE} does not exist."
	read -p "Press [Enter] to update your lock-file and dependencies, or [Ctrl]+[C] to cancel:" cancel
	deno cache \
		${RUN_PERMISSIONS} \
		${LOCK_OPTIONS_WRITE} \
		${IMPORT_MAP_OPTIONS} \
		${USE_UNSTABLE} \
		${DENO_DEPENDENCIES_FILE}

build: test-quiet
	@echo "// deno-fmt-ignore-file"            >  ${DENO_BUNDLE_FILE}
	@echo "// deno-lint-ignore-file"           >> ${DENO_BUNDLE_FILE}
	@echo "// @ts-nocheck"                     >> ${DENO_BUNDLE_FILE}
	deno bundle ${IMPORT_MAP_OPTIONS} ${DENO_MAIN} >> ${DENO_BUNDLE_FILE}

cache:
	deno cache \
		${RUN_PERMISSIONS} \
		${LOCK_OPTIONS} \
		${IMPORT_MAP_OPTIONS} \
		${USE_UNSTABLE} \
		${DENO_DEPENDENCIES_FILE}
	$(shell DENO_DIR=;deno cache \
		${RUN_PERMISSIONS} \
		${LOCK_OPTIONS} \
		${IMPORT_MAP_OPTIONS} \
		${USE_UNSTABLE} \
		${DENO_DEPENDENCIES_FILE})

clean:
	rm -rf                \
		${DENO_BUNDLE_FILE}  \
		${NODE_GEN_DIR}
	cd ${NODE_DIR} && ${NPM_RUN} clean

configure:
	./configure

deno: test build

fmt: format

format:
	deno fmt ${DENO_SOURCE_DIR} ${DENO_LIB_DIR}

install: ${LOCK_FILE}

lint:
	deno fmt --check ${RUN_PERMISSIONS} ${DENO_SOURCE_DIR}
	-deno lint --unstable ${RUN_PERMISSIONS} ${LINT_FILES}

lint-quiet:
	deno fmt --quiet --check ${RUN_PERMISSIONS} ${DENO_SOURCE_DIR}
	-deno lint --quiet --unstable ${RUN_PERMISSIONS} ${DENO_SOURCE_DIR}

node: node-build node-test

node-build: test-quiet
	@echo
	@echo Building for NodeJS/NPM, etc. ...
	@echo ↪ This code is a proof-of-concept and is not intended for production!
	@echo
	mkdir -p ${NODE_GEN_DIR}
	rsync -am --include="*.ts" --delete-during \
		${DENO_APP_DIR}/ \
		${NODE_GEN_DIR}/
	find ${NODE_GEN_DIR} -type f -name "*.ts" -exec \
		sed -i -E "s/(from \"\..+)\.ts(\";?)/\1\2/g" {} +
	cd ${NODE_DIR} \
		&& ${NPM_INSTALL} \
		&& ${NPM_RUN} clean \
		&& ${NPM_RUN} build:production \
		&& ${NPM_RUN} test

node-link:
	cd ${NODE_DIR} && ${NPM_LINK}

node-test:
	cd target/node && ${NPM_RUN} test

run:
	deno run ${RUN_PERMISSIONS} ${DENO_MAIN}

test: install lint
	deno test --unstable --coverage  \
		${TEST_PERMISSIONS} ${LOCK_OPTIONS} ${CACHE_OPTIONS} \
		${IMPORT_MAP_OPTIONS} \
		${DENO_SOURCE_DIR}

test-quiet: install lint-quiet
	deno test --unstable --failfast --quiet \
		${TEST_PERMISSIONS} ${LOCK_OPTIONS} ${CACHE_OPTIONS} \
		${IMPORT_MAP_OPTIONS} \
		${DENO_SOURCE_DIR}

test-watch: install
	while inotifywait -e close_write ${DENO_APP_DIR} ; do make test;	done

upgrade:
ifneq (${LOCK_FILE},)
	read -p "Press [Enter] to update your lock-file and dependencies or [Ctrl]+[C] to cancel:" cancel
	deno cache --reload \
		${RUN_PERMISSIONS} ${LOCK_OPTIONS_WRITE} ${IMPORT_MAP_OPTIONS} ${USE_UNSTABLE} \
		${DENO_DEPENDENCIES_FILE}
endif

# Yes, most everything is .PHONY, I don't care 😏
.PHONY: \
	all \
	build \
	cache clean configure \
	deno \
	fmt format \
	install \
	lint lint-quiet \
	node node-build node-link node-test \
	run \
	test test-quiet test-watch \
	upgrade
