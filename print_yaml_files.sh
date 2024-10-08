#!/bin/bash

# Find all .yml and .yaml files in the current directory
find . -maxdepth 1 -type f \( -name "*.yml" -o -name "*.yaml" \) | while read -r file; do
  echo "File: $file"
  cat "$file"
  echo
done