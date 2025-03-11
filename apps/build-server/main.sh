#!/bin/bash

export GIT_REPOSITORY__URL="$GIT_REPOSITORY__URL"

if [ ! -d "/home/app/projects/.git" ]; then
  git clone "$GIT_REPOSITORY__URL" /home/app/projects
else
  echo "Repository already exists, skipping clone..."
  echo "Project files"
  ls  /home/app/projects

fi

exec node script.js