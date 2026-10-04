# Agent Guidelines

- Run `markdownlint` on any edited Markdown files using the repository configuration with `markdownlint --config .markdownlint.json README.md`. Replace `README.md` with each file you change.
- If lint errors occur, fix them before creating a pull request.
- Verify the site builds with `bundle exec jekyll build` when possible.
- Please name your branch to include codex or agent in the branch name
- If you cannot run markdownlint please warn your user to setup their environment using the instructions in README.md and document your failure in your pr description

## Docusaurus migration

- Read [the execution plan](DOCUSAURUS_EXECUTION_PLAN.md) and
  [migration evidence guidance](migration/README.md) before migration work. Treat
  older migration checklists as historical observations; verify phase status
  against receipts and the current source revision.
- Use the toolchain recorded by the selected receipt. The shell's default Node
  version may differ. Run evidence-tool tests with
  `node --test scripts/migration-*.test.mjs`; those tests do not establish site
  fidelity or hosted CI success.
- Capture builds from a clean, full-history control checkout. Generate source
  inventories from immutable snapshots, separately from a build that may write
  generated data. A supplied SHA becomes evidence only after its file hashes are
  verified against that Git object.
- Keep framework-regression evidence separate from the pinned legacy-content
  reference. A successful build or unchanged route count does not prove notices,
  metadata, examples, or downloadable records survived.
- Retain `layout: bidder` until its discovery consumers are migrated. Preserve
  raw metadata and distinguish omitted, false, and unknown values; resolve the
  field-policy disputes in the reference contract before normalizing them.
- Use `git mv` for tracked-file relocations. Run converter/reconciliation trials
  in isolated staging; protect code examples and check final output paths before
  moving or writing files.
- Keep source-backed, disputed, unexecuted, local-build, hosted-CI, and deployment
  results distinct. New source/lock/tool changes require relevant new evidence.
- Record durable lessons in [context notes](migration/CONTEXT_NOTES.md), with
  supporting artifacts and limits. Keep changing counts, SHAs, and open decisions
  in receipts/the execution plan rather than duplicating them here.
