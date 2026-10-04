#!/usr/bin/env node
// Retired after M2 probes found code rewriting and destination overwrite defects.
// Historical implementation remains at docusaurus commit 6a64af8.
console.error('The legacy migration writer is retired. Run node scripts/migration-pilot.mjs --out <new-staging-directory> for the bounded, source-pinned M2 pilot. See migration/M2_PILOT.md for scope and manual cases.');
process.exitCode = 1;
