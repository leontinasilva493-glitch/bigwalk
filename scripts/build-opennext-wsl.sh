#!/usr/bin/env bash

# Git keeps this script LF-only so WSL can execute it after a Windows checkout.
set -euo pipefail

source_dir="$(pwd -P)"

if [[ ! -f "$source_dir/package.json" || ! -f "$source_dir/wrangler.jsonc" ]]; then
  echo "Run this command from the Big Walk project root." >&2
  exit 1
fi

work_dir="$(mktemp -d "${TMPDIR:-/tmp}/bigwalk-opennext.XXXXXX")"

cleanup() {
  rm -rf -- "$work_dir"
}

trap cleanup EXIT

echo "Copying the current working tree to WSL's native filesystem: $work_dir"
tar \
  --exclude=.git \
  --exclude=.next \
  --exclude=.open-next \
  --exclude=.wrangler \
  --exclude=node_modules \
  --exclude=coverage \
  -C "$source_dir" -cf - . | tar -C "$work_dir" -xf -

cd "$work_dir"
npm ci --no-audit --no-fund
npm run cf:build

worker_file="$work_dir/.open-next/worker.js"
if [[ ! -s "$worker_file" ]]; then
  echo "OpenNext finished without a non-empty .open-next/worker.js artifact." >&2
  exit 1
fi

worker_bytes="$(wc -c < "$worker_file" | tr -d ' ')"
echo "OpenNext worker verified in WSL native storage ($worker_bytes bytes)."
