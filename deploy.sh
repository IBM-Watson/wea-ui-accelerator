#!/bin/bash
set -e

build() {
  npm install
  node_modules/gulp/bin/gulp.js --target $GULP_TARGET
  echo "Build done."
}

deploy() {
  mkdir -p $TARGET_DIR
  /bin/cp -r dist/* $TARGET_DIR
  chown -R wd-wea-ux:apache $TARGET_DIR
  echo "Application deployed."
}

if [[ $# -lt 2 ]] ; then
    echo "Usage: $0 sandbox|develop|production TARGET_DIR"
    exit 0
fi

GULP_TARGET=$1
TARGET_DIR=$2

build
deploy
