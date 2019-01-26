#!/bin/bash
#

NVM_DIR="$HOME/.nvm"
source $NVM_DIR/nvm.sh
nvm use v8
node app.js
