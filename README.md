This repository contains the source files for the Prebid.js documentation site at [Prebid.org](https://prebid.org).

Please see the sections below for more information:

* [Contributing](#contributing)
* [License](#license)
* [Prerequisites](#prerequisites)
* [Running Jekyll Locally](#running-jekyll-locally)
* [Building Assets](#building-assets)
* [The Downloads Page](#the-downloads-page)
* [Thanks](#thanks)

<a name="contributing"></a>

## Contributing

Thanks in advance for your contribution!

For smaller changes, such as fixing a typo or adding a new section to an existing page, submit a pull request.

For larger changes such as reorganizing the site and moving/removing content, you may want to open an issue so we can discuss the work beforehand.  This is a good idea because:

* We want to value your time, so you don't do unnecessary work
* We want to value our users' time; we don't want to break links and bookmarks for users

<a name="license"></a>

## License

All docs are under the license shown in the `LICENSE` file in this directory.

<a name="prerequisites"></a>

## Prerequisites

The site is hosted on GitHub pages, and uses [Jekyll](https://jekyllrb.com/) to generate the HTML. Jekyll is written in the [Ruby](https://www.ruby-lang.org/en/) language.

1. follow the instructions at https://jekyllrb.com/docs/installation/ for your OS
1. gem install github-pages
1. start Jekyll as described below

For CSS, the site uses Laravel Mix to build CSS from Sass (scss-flavored) source files. Under the hood Laravel Mix uses Webpack.

1. follow the instructions at https://nodejs.dev to install Node.js for your OS
1. `npm ci` to install packages for building assets
1. build assets as described below

The markdown files are linted via [markdownlint-cli](https://github.com/igorshubovych/markdownlint-cli). VSCode supports the [.markdownlintignore](.markdownlintignore) file.
You may need to configure the disabled rules specified in [.markdownlint.json](.markdownlint.json) directly in your project settings. You can invoke linting in CLI via

```bash
markdownlint --config .markdownlint.json --ignore-path .markdownlintignore "**/*.md"
```

<a name="running-jekyll-locally"></a>

## Running Jekyll Locally

Before submitting a pull request, you should run the site locally to make sure your edits actually work.

To get started editing the site and seeing your changes, clone this repo and enter the following commands in your terminal:

```bash
JEKYLL_ENV=production bundle exec jekyll serve --watch --incremental
```

You should see output that looks something like this:

```bash
Configuration file: /Users/me/git/prebid.github.io/_config.yml  
            Source: /Users/me/git/prebid.github.io  
       Destination: /Users/me/git/prebid.github.io/_site  
 Incremental build: disabled. Enable with --incremental  
      Generating...   
                    done in 13.596 seconds.  
 Auto-regeneration: enabled for '/Users/me/git/prebid.github.io'  
Configuration file: /Users/me/git/prebid.github.io/_config.yml  
    Server address: http://127.0.0.1:8080/  
  Server running... press ctrl-c to stop.  
...  
...  
```

Open the `Server address` URL in your browser, and you should see a locally running copy of the site.

<a name="building-assets"></a>

## Building Assets

* `npm run dev` to build unminified CSS for development
* `npm run prod` to build minified CSS for production
* `npm run watch` to use [Browsersync](https://browsersync.io) to rebuild CSS on demand and reload the browser

## The Downloads Page

Please don't submit PRs to the Prebid.org downloads page. That page gets updated in tandem with the Prebid.js release process.

The Downloads page is generated from [the Markdown bidder adapter docs](https://github.com/prebid/prebid.github.io/tree/master/dev-docs/bidders), so the process for updating is:

1. Your adapter code is merged into Prebid.js
2. Your bidder docs PR is submitted over here to the docs site
3. Your adapter code is included with a release
4. Once your adapter code is actually released, we merge the adapter docs PR, and the Downloads page is automagically updated with a checkbox to include your adapter.

This means an adaptor is not available to download from Prebid.org as soon as the code gets merged into Prebid.js - it will be available after the next release (usually in a couple of weeks).

<a name="thanks"></a>

## Liquid Templating

- [jekyll - check for non empty](https://michaelcurrin.github.io/dev-cheatsheets/cheatsheets/jekyll/liquid/conditionals/non-empty.html)

## Thanks

Many thanks to the following people who have submitted content to Prebid.org.  We really appreciate the help!
