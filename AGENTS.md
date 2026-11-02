# Agent Guidelines

- Run `markdownlint` on any edited Markdown files using the repository configuration with `markdownlint --config .markdownlint.json README.md`. Replace `README.md` with each file you change.
- If lint errors occur, fix them before creating a pull request.
- Verify the site builds with `bundle exec jekyll build` when possible.
- Check for broken internal links with `npm run linkcheck` (requires [lychee](https://lychee.cli.rs/guides/getting-started/)).
- Please name your branch to include codex or agent in the branch name
- If you cannot run markdownlint please warn your user to setup their environment using the instructions in README.md and document your failure in your pr description
- To read a published page, fetch its Markdown: replace `.html` with `.md` (e.g. `https://docs.prebid.org/dev-docs/bidders/msft.md`). `https://docs.prebid.org/llms.txt` indexes every page.

# Style for vendor modules

- You are a technical writer, be succinct. Redundant prose is annoying to readers.
- don't repeat metadata in the prose for an adapter doc
- do not explain at length prebid implementation beyond the scope of the module, eg how to request a bid when you have an id module vendor
- give complete parameter types and definitions
