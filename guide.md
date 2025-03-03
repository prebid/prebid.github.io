---
layout: page_v2
title: prebid.org website guide
description: details about how the site works
isNew: false
sidebarType: 0
---

# Prebid Website Maintenance Guide

{:.no_toc}

Updated Feb 9, 2023

- TOC
{:toc}

## Getting started

The easiest way to setup an environment to contribute to the docs or review pull requests is [Github Codespaces](https://github.com/features/codespaces).

1. Open [github.com/prebid/prebid.github.io](https://github.com/prebid/prebid.github.io)
2. Click on the `Code` drop down menu and select "create new codespace from master" by clicking on the + icon. 
   If you have no access to prebid.github.io, then you should do this on your fork of the repository
3. Start the jekyll build as described in the `TERMINAL` of your codespace
    1. `JEKYLL_ENV=production bundle exec jekyll serve --watch --incremental`
    2. Codespaces will display a notification to open the running instance in the browser.
4. In the `PORTS` tab you find the running instance

This repository contains a [devcontainer.json](.devcontainer/devcontainer.json) that setups the codespace or your favourite IDE. It includes the [markdownlint extension](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint), ruby and installs all dependency on setup through `bundle install`.

## Reviewing Pull Requests and Issues

Being a reviewer means you're in weekly rotation where you keep an eye on pull requests (PRs) and issues opened in this repo.

### PR Review Guidelines

1. Make sure no inappropriate changes are made. This covers obvious things like bad language and content, but we also don't allow overt marketing language on the site. Phrases like "we're the best BLAH" or "number one FOOZIT" need to be toned down.
2. Make sure competitors aren't messing with each other's docs. This can be hard to tell because we don't know which github handles belong to which companies, but in general, if a destructive or suspicious change is being made to a doc, check on the Prebid Slack channel or the original github author to confirm that the affected company approves the change.
3. Make sure the change doesn't break formatting. It's not always necessary to preview locally, but for large changes, it's worthwhile verifying visually because markdown can be cranky.
4. Help the author with basic readability - if you as a reviewer don't understand a sentence, probably others will have trouble too. Push back and ask questions about what they're really trying to say.
5. We don't generally merge a docs PR until the related code is released. Prebid.js releases happen on Weds or Thurs, and people really like to have their docs PRs merged shortly after the code is released. For Prebid Server, it's ok to merge the docs after the code is merged. If they don't link a code PR, you can go search for it or just ask them to provide a link.
6. Fix broken or out-of-date things you run across. At least flag it in the team slack channel so we can fix it someday.
7. Bid Adapter Guidelines
    1. Check the metadata (aka front-matter): required fields are title and either pbjs or pbs, but in general, the adapter should supply at least half of the available fields. If they don't you should add a "request changes" note like "This document is missing quite a few pieces of adapter metadata. Please fill out the metadata as documented at [https://docs.prebid.org/dev-docs/bidder-adaptor.html#submitting-your-adapter](https://docs.prebid.org/dev-docs/bidder-adaptor.html#submitting-your-adapter)"
    2. Every adapter needs a parameters table that contains exactly 5 columns in this order: Name, Scope, Description, Example, Type.
    3. Discourage full-page HTML examples. Better to have just the bidder-specific logic and a pointer to a standard Prebid.js example.
    4. All headers must be level 3, 4, or 5.
    5. As for the `media_types` metadata, if they don't support display, then the need to define "no-display". This is because the default metadata table in pbs-bidders.md assumes everyone supports display.
    6. If they claim `tcfeu_support: true`, they must also supply a `gvl_id`. You should check on the [TCF vendor list](https://vendor-list.consensu.org/v3/vendor-list.json) that the GVL ID supplied makes sense. If it's an alias they may define the GVL ID like this: `gvl_id: 14 (adkernel)`
    7. Don't let them claim both pbjs and pbs if they don't have both a Prebid.js and Prebid Server adapter. It's ok to have either a PBS-Go or PBS-Java adapter.
    8. They cannot claim `fpd_supported` unless the body of their documentation has a section describing how exactly they support First Party Data. You can reject this with a note like "Sorry - you can't claim FPD support unless the document has a description of what kind of First Party data. See the [http://docs.prebid.org/dev-docs/bidder-adaptor.html#submitting-your-adapter](http://docs.prebid.org/dev-docs/bidder-adaptor.html#submitting-your-adapter). We recommend looking at how other adapters have done this. e.g. you can declare that you support site first party data, user first party data, impression-level data, seller-define audience, etc."
    9. If they claim to be a `prebid_member`, you can check that on the [prebid.org membership page](https://prebid.org/member-directory/)

## Core Technologies

The Prebid website is developed using [GitHub pages](https://pages.github.com/) and [Jekyll](https://jekyllrb.com/), a static site generator which uses the following technology to create and style HTML pages. See the [main README file](https://github.com/prebid/prebid.github.io/blob/master/README.md) for instructions on how to set this up.

**Markdown**: The majority of the content is written in Markdown language. Jekyll transform this into raw HTML.

Learn more about [Markdown](https://www.markdownguide.org/)

**Bootstrap**: A CSS template for responsive site design. Bootstrap provides the base formatting for the site.

Learn more about [Bootstrap](https://getbootstrap.com/docs/4.1/getting-started/introduction/_)

**Liquid**: A language created by Shopify to enable dynamic HTML creation.

Learn more about [Liquid](https://help.shopify.com/en/themes/liquid/basics)

**Javascript**: A combination of Javascript libraries are utilized for the Prebid site to include [JQuery](https://jquery.com/) and [BootstrapJS](https://getbootstrap.com/docs/3.3/javascript/) as well as custom code.

**CSS**: The site builds on the base Bootstrap template with custom CSS stored in the style.css file.

### Environment

- prebid.org is built with Wordpress. We call it "the marketing site". We generally use a contracting company to make major updates there so it's pretty. But if you know Wordpress, we may give you permissions to do minor updates there.
- docs.prebid.org is the Github pages site. We call it "the docs site".
- dev.prebid.org is served through Netlify from the 'dev' branch of the repo. It's often out of date and only used for major projects or for sharing major docs for external review.
- stage.prebid.org is also served through Netlify, but from the 'staging' branch. You should assume it's out of date.

On the rare occasions where we need to use the 'dev' or 'stage' sites, we just check with each other to make sure it's not already being used for something.

## Site Config

The `_config.yml` file (note underscore prefix) sets the base configuration for the site. Refer to [Jekyll](https://jekyllrb.com/docs/configuration/) documentation on which properties can be set in the `_config.yml` file.

***

## Directory Structure

Jekyll requires adherence to a certain directory structure to generate the site. Directories prefixed with an underscore contain files used to construct the html files of the site.

### File Construction

For the Prebid.org site the following directories are used:

**_data**  
Jekyll was originally designed specifically for creation of blogging websites and not for dynamic, data-driven sites. However, by including the _data directory we can mimic a database structure to create a more robust site. Files in this directory can be saved in either _json_, _yml_ or _csv_ format. For Prebid.org they have been saved in _yml_.

Learn more about YML [here](https://yaml.org/start.html)

There are several YML files in the Prebid _data directory

- [dropdown_v2](#dropdown)
- [sidebar](#sidebar)
- [partners](#partners)

The contents of these files are used throughout the Prebid.org site for dynamically creating the navigation and displaying messages. See the [Data Model](#data-models) section for a review of how the data is structured and to see sample code.

**_layouts**  

The layout directory contains HTML files that, in conjunction with CSS and JS files, format the layout of pages throughout the site.

**_includes**

The includes directory contains HTML files that can be included within files, such as a file for the header and footer.

**_bidders**

The bidders directory is not a standard part of Jekyll; it’s a special use directory specifically to construct the table of bidders on dev-docs/bidders.md and dev-docs/pbs-bidders.md

**_sites**

The sites directory is created by Jekyll. It contains the live site generated from the collected files and data listed above, combined with the CSS, JS and image assets and the Markdown files for individual pages.

***

## Assets

The assets directory contains the CSS, Javascript, images and other assets used to create the site.

The base CSS file used is Bootstrap (version 4.6.3) Custom CSS and modifications to Bootstrap classes are contained in the [_sass/vendor/_bootstrap.scss](_sass/vendor/_bootstrap.scss) file.

The JS directory contains the Javascript files required for the Prebid.org site. It includes JQuery and Bootstrap javascript frameworks as well as other third party libraries and custom javascript written specifically for the Prebid site. For JQuery and Bootstrap both the expanded and minified versions of the javascript files are included but only the minified files are linked from the site header.

### CSS

1. Styles all come from `/assets/css/main-bundle.scss`
1. These are generated from [_sass/main.scss](_sass/main.scss)
1. To make a change, edit the relevant sass file

If you want to upgrade bootstrap

1. Upgrade bootstrap in the [package.json](package-lock)
1. Run `npm install`. This will update the node_modules commited in [_sass/node_modules](_sass/node_modules)
1. Commit the updated node module source files

## Data Models

The data files are stored in the __data directory.

<a name="Dropdown"></a>

### Dropdown

The dropdown_v2 YML file is used to construct the top nav when the site is viewed on desktops and tablets.

The YML map is divided into collections of menu sections. Menu sections are commented when they begin, for example;

```markdown
#----------Product SubNav------------
```

Each menu item is represented in the YML map as a collection of key value pairs and begins with a dash (-) symbol. An indented collection indicates it is a child of the collection above it. Example:

```markdown
#-----------Overview---------------

- sectionId: 0
  sectionName: Overview
  link:
  isHeader: 1
  hasSubMenus: 1
  submenus:

  - subsectionId: 0
    sectionId: 0
    sectionName: Overview
    title: What is Prebid?
    link:  /overview/intro.html
    needsDivider: 0
    isHeader: 0
    isSubSectionStart: 1
```

The collection with the title property "What Is Prebid?" is a child of the collection directly above it with the sectionName "Overview"

**Top Nav Menu Collection Properties**  
_Note: A collection does not have to contain all properties. For Bools 1 = true, 0 = false_

| Key | Type | Example | Use |
| ------ | ------ | ------ | ------ |
| sectionId| Int | 3 | Indicates the menu section of an item. |
| sectionName |  string | Overview  | The display name of the section. |
| link |  string | /overview/intro.html  | The relative link that the menu item should open. |
| isHeader | bool | 1 | Indicates if this item is a section header. |
| hasSubMenus | bool | 1 | Indicates if this item has submenus. |
| submenus | collection | | If the item has submenus they will be contained in a collection of collections. |
| subsectionId | int | 3 | Indicates the subsection of an item. |
| needsDivider | bool | 0 | Indicates if the subsection item is the last item in the section and requires a divider. **Deprecated** |
| isSubsectionStart  | bool | 0 | Indicates if the item is the start of a subsection. **Deprecated** |

**Code Use**  
This data file is read in the nav.html file using Liquid. (_`_includes/nav.html`).

<a name="Sidebar"></a>

### Sidebar

The sidebar YML file is used to construct the left side navigation when the site is viewed on desktops and tablets and the top navigation when viewed on phones.

The YML map is divided into collections of menu sections. Menu sections are commented when they begin, for example;

```Markdown
#--------------Overview--------------|
```

Each menu item is represented in the YML map as a collection of key value pairs and begins with a dash (-) symbol. An indented collection indicates it is a child of the collection above it. Example:

```Markdown
#--------------Overview--------------|

- sbSecId: 0
  title:
  link:
  isLastSubSectionItem: 0
  isHeader: 0
  isSectionHeader: 1
  sectionTitle: Overview
  sectionId: overview
  subgroup: 1000
  sbCollapseId: overview


- sbSecId: 0
  title: General
  link:
  isLastSubSectionItem: 0
  isHeader: 1
  headerId: general
  isSectionHeader: 0
  sectionTitle:
  subgroup: 0
  ```

**Side Nav Menu Collection Properties**  
_Note: A collection does not have to contain all properties. For bools 1 = true, 0 = false_*

| Key | Type | Example | Use |
| ----- | ----- | ----- | ----- |
| sbSecId |  int | 3  | Indicates the menu section of an item. |
| title  |  string | General  | The text displayed for the menu section. |
| link |  string | /overview/intro.html  | The relative link that the menu item opens. |
| isLastSubSectionItem  |  bool | 0  | Indicates if the menu item is the last item in a subsection. |
| isHeader |  bool | 0  | Indicates if the menu item is a sub section header. |
| headerId |  string | general  | Required if isHeader = 1. Used to identify which div object is being toggled. |
| isSectionHeader |  bool | 0  | Indicates if the menu item is a section header. |
| sectionTitle |  string | Overview  | Text displayed for the section. |
| sectionId |  string | overview  | Required if isHeader = 1. Used to identify which div object is being toggled. |
| subgroup |  int | 3  | Indicates the subgroup that contains this item. |
| sbCollapseId |  string | overview  | Required if isSectionHeader = 1. Used to identify which div object is being toggled. |

**Code Use**  
This data file is read in the left_nav.html file using Liquid. (__includes/left_nav.html)

**Files Not in the Sidebar**  
If a page is open that is not listed in the sidebar.yml file, by default the sidebar will display only top-level options, with no options expanded or selected.

In certain cases, it is helpful to the user to highlight a page in the left navigation that is not currently open. For example, when a bidder page is open (such as [docs.prebid.org/dev-docs/bidders/1ad4good.html](https://docs.prebid.org/dev-docs/bidders/1ad4good.html)), we don't want hundreds of bidders displayed in the left nav, but we want the user to be oriented to where they are in the documentation. In this case, that would be under Prebid.js > Reference > Bidder Params. To accomplish this, you must do two things:

- Add `sidebarType: 1` to all bidder pages. This opens the Prebid.js menu. (If you want to extend this functionality to other pages, use the sbSecId in the sidebar.yml file of the top-level menu as the value for sidebarType.)
- Modified the left_nav.html file's Liquid code to highlight Reference > Bidder Params anytime a page with layout=bidder is open.

This has been done for both bidders pages (pages with `layout: bidder`) and the Publisher API Reference (`layout: api_prebidjs` and highlighting Prebid.js > Reference > Publish API Reference in the left nav), but can be extended to other pages as needed.

### Disclosure Includes

The docs offer a set of predefined disclosures that should be used where appropriate.

#### Module does fingerprinting

{% include dev-docs/fingerprinting.md %}

```liquid
{%raw%}{% include dev-docs/fingerprinting.md %}{%endraw%}
```

### Module loads external javascript

{% include dev-docs/loads-external-javascript.md %}

```liquid
{%raw%}{% include dev-docs/loads-external-javascript.md %}{%endraw%}
```

#### Prebid Server works only with client-side adapter available

{% include dev-docs/pbjs-adapter-required-for-pbs.md %}

```liquid
{%raw%}{% include dev-docs/pbjs-adapter-required-for-pbs.md %}{%endraw%}
```

#### Example uses build from source

{% include dev-docs/build-from-source-warning.md %}

```liquid
{%raw%}{% include dev-docs/build-from-source-warning.md %}{%endraw%}
```

#### Example uses not for production assets

{% include dev-docs/not-for-production-warning.md %}

```liquid
{%raw%}{% include dev-docs/not-for-production-warning.md %}{%endraw%}
```

#### Legal disclosure

{% include legal-warning.html %}

```liquid
{%raw%}{% include legal-warning.html %}{%endraw%}
```

## Partners

TBD

## Bidder Files

There are 200+ bidder files in the /dev-docs/bidders directory describing the parameters for each Prebid.js bidder. There are two unfortunately identical pieces of code that process them:

- /\_layouts/bidder.html - this is used to generate the single-bidder version of the page like <https://prebid.org/dev-docs/bidders/rubicon.html>
- /dev-docs/bidders.md - this is used to generate the (large) combined page at <https://prebid.org/dev-docs/bidders.html>

The attributes in the Jekyll 'front matter' drive various behaviors and dynamic tables elsewhere on the site.

{: .table .table-bordered .table-striped }

| Key | Required? | Values | Use |
| ----- | ------ | ------ | ------ |
| layout | yes | bidder | Links this file to the bidder.html layout |
| title | yes | company name | For display |
| pbjs | sorta | true or false | defines whether this is a Prebid.js bidder |
| pbs | sorta | true or false | defines whether this is a Prebid Server bidder |
| description | no | - | Not used |
| biddercode | yes | preferred bidder code | Used as the default ad server targeting suffix and the default download filename |
| aliasCode | no | bid adapter that actually implements this adapter | Overrides the filename used to build the PBJS package on the download page. Will be suffixed with "BidAdapter". This is also intended to be a valid bidder code. |
| filename | no | bid adapter that actually implements this adapter | Used when a bid adapter is created with a filename that is not the bidder code. This completely overrides what is passed into the gulp build command, so needs to be fully specified. e.g. bidderaBidAdapter |
| prevBiddercode | no | secondary bidder code | Adds a note about an alternate code that may have been used. |
| pbjs_version_notes | no | string | Displays on the download page |
| sidebarType | yes | `1` | Used for navigation. This opens the Prebid.js portion of the menu so the sidebar can display the Reference/Prebid Params menu option when a bidder page is open. |
| ANYTHING ELSE | no | string | There are many pieces of metadata (e.g. GDPR support, user IDs supported) that bid adapters can disclose. They're displayed on the bidder's parameter page. |

The bidderCode, aliasCode, and prevBiddercode parameters bear some description.
Some adapters have a longer bidderCode and a shorter bidderCode -- their adapter supports both (with the `alias` feature) but
there's only one documentation file and of course one PBJS adapter file. An relatively common scenario is when the company started off with a
long bidderCode, but found it awkward to set up ad server targeting variables because GAM limits you to 20 chars, which is easy to exceed
with a prefix like `hb_cache_host`. So they wanted to have shorter bidderCode for new customers while supporting the legacy targeting variables. In that scenario, they:

1. add the shorter code as an alias in their PBJS file, which can stay the old longer name
2. change the biddercode to the shorter name as it's the new preferred code
3. add aliasCode so the Download page will pull in the right module
4. optionally add prevBiddercode to add a note to the page about the legacy value
5. optionally add filename if the bid adapter was created using a filename that's different than their bidder code. e.g. if the biddercode is "biddera" but they named the file "bidderABidAdapter", set the biddercode to "biddera" and the filename to "bidderABidAdapter".

## Algolia Search

We use Algolia for site search.

- The configuration defining the search parameters is at <https://github.com/algolia/docsearch-configs/blob/master/configs/prebid.json>
- Only elements p, th, td, li, code, and h1-h3 are indexed
- Code implementation in _includes/body-end.html and a the 'site-search' div in the header.

## Cookie Privacy

Prebid websites don't set their own cookies, but vendor products we use do. So we use the consentmanager.net to pop up a cookie banner. If the user hasn't consented to setting cookies, they will find reduced functionality on the site -- they won't be able to view JSFiddle examples or example videos.

This is implemented with the [consentmanager third party blocking feature](https://help.consentmanager.net/books/cmp/page/how-to-block-third-party-codes-cookies-if-no-consent-is-given). See layout/example.md for an example implementation.

The test case for vendor code that drops cookies is simple:

- clear your prebid.org cookies
- reload the page
- confirm the cookie banner appears
- confirm the vendor's functionality doesn't appear
- confirm that the vendor didn't set any cookies
