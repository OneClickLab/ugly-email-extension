#!/usr/bin/env bash

# remove build dir
if [ -d ./build ]; then
  rm -R ./build
fi

# create fresh build dir
mkdir build

# zip builds
zip -r build/chrome.zip dist/chrome/*
zip -r build/firefox.zip dist/firefox/*
