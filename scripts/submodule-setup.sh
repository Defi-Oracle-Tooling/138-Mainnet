#!/bin/bash

# Initialize submodules
git submodule init
git submodule update --remote --recursive

# Setup each submodule
for module in $(git config --file .gitmodules --get-regexp path | awk '{ print $2 }'); do
    echo "Setting up $module..."
    (cd $module && pnpm install)
done

# Link dependencies
pnpm install
pnpm run build
