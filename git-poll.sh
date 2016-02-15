#!/bin/bash

# Runs `COMMAND` if changes detected by `git fetch`
if [ $# -lt 3 ] || [ $2 != "-c" ] ; then
    echo "Usage: $0 sandbox|develop|master -c COMMAND"
    exit 0
fi

GIT_BRANCH=$1
shift
shift
COMMAND=$@

# git polling
# http://stackoverflow.com/a/7166702

# initialize if this is the 1st poll
if [ ! -f prev_head ]; then
  git checkout $GIT_BRANCH
  git rev-parse $GIT_BRANCH > prev_head
fi

# fetch & merge, then inspect head
git fetch
if [ $? -eq 0 ] ; then
  echo "Fetch from git done."
  git pull
  git rev-parse $GIT_BRANCH > latest_head
  if ! diff latest_head prev_head > /dev/null ; then
    echo "Merge via git done."
    cat latest_head > prev_head # update stored HEAD
    $COMMAND
  else
    echo "No changes detected."
  fi
fi
