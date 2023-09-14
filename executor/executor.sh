#!/usr/bin/env nix-shell 
#! nix-shell -i bash --pure
#! nix-shell -p bash python3Minimal jdk19_headless gcc13

cd result/bin

./executor
