#!/bin/bash
set -e

echo "Building static site..."
node build.js

echo "Starting server..."
node serve.js
