# Agent Guidelines

- Run `markdownlint` on any edited Markdown files using the repository configuration:
- 
  ```bash
  markdownlint --config .markdownlint.json README.md
  ```
  
  Replace `README.md` with each file you change.
- If lint errors occur, fix them before creating a pull request.
- Verify the site builds with `bundle exec jekyll build` when possible.
- Please name your branch to include codex or agent in the branch name
