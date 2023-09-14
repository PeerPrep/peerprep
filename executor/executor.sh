#!/usr/bin/env nix-shell 
#! nix-shell -i bash --pure
#! nix-shell -p bash python3Minimal jdk19_headless

cd result/bin

./executor
