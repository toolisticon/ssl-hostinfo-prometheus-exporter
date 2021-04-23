#!/bin/bash

cd $HOME
NVM_DIR="$HOME/.nvm"
source $NVM_DIR/nvm.sh
# TODO fix webpack build, see https://github.com/toolisticon/ssl-hostinfo-prometheus-exporter/issues/98
node app.js
