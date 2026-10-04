#!/usr/bin/env bash
set -euo pipefail
mkdir -p /work /receipts/setup
sha256sum /input/source.bundle /input/run.sh > /receipts/setup/input-sha256.txt
git clone --quiet --branch codex/docusaurus-m1 /input/source.bundle /work/site
cd /work/site
test "$(git rev-parse HEAD)" = "3d8cfd6b7f6635bc5dbcdb40a543eeec6f4a592e"
test "$(git rev-parse --is-shallow-repository)" = "false"
git status --porcelain > /receipts/setup/status-before.txt
test ! -s /receipts/setup/status-before.txt
node scripts/validate-toolchain.mjs | tee /receipts/setup/toolchain.json
node -e 'console.log(JSON.stringify({platform:process.platform,architecture:process.arch,node:process.version}))' > /receipts/setup/platform.json
test ! -e /tmp/candidate-npm-cache
npm ci --include=dev --ignore-scripts --cache /tmp/candidate-npm-cache 2>&1 | tee /receipts/setup/install.log
npm ls --all --json > /receipts/setup/dependencies.json
npm ci --prefix .github/workflows/scripts --ignore-scripts --no-audit --no-fund --cache /tmp/notifier-npm-cache 2>&1 | tee /receipts/setup/notifier-install.log
node -e 'const r=require("node:module").createRequire(process.cwd()+"/.github/workflows/scripts/package.json"); console.log(JSON.stringify({axios:r("axios/package.json").version,nodemailer:r("nodemailer/package.json").version}));' > /receipts/setup/notifier-versions.json
npm run typecheck 2>&1 | tee /receipts/setup/typecheck.log
npm run test:migration 2>&1 | tee /receipts/setup/tests.log
node scripts/validate-site.mjs --baseline-ref 0791a5b7a9c84f7ff4be1433a4bcb34f17f00c0d --out /receipts/site 2>&1 | tee /receipts/setup/site.log
git status --porcelain > /receipts/setup/status-after.txt
test ! -s /receipts/setup/status-after.txt
printf 'Linux clean-checkout validation passed\n' | tee /receipts/setup/result.txt
