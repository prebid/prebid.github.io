---
layout: page_v2
title: prebid.org website guide
description: details about how the site works
isNew: false

sidebarType: 0
---

# Prebid Website Maintenance Guide

v 1.2  
Sept 24, 2021

***

## Reviewing Pull Requests and Issues

Being a reviewer means you're in weekly rotation where you keep an eye on pull requests (PRs) and issues opened in this repo.

### PR Review Guidelines

1. Make sure no inappropriate changes are made. This covers obvious things like bad language and content, but we also don't allow overt marketing language on the site. Phrases like "we're the best BLAH" or "number one FOOZIT" need to be toned down.
2. Make sure competitors aren't messing with each other's docs. This can be hard to tell because we don't know which github handles belong to which companies, but in general, if a destructive or suspicious change is being made to a doc, check on the Prebid Slack channel to confirm that the affected company approves the change.
3. Make sure the change doesn't break formatting. It's not always necessary to preview locally, but for large changes, it's worthwhile verifying visually because markdown can be cranky.
4. Help the author with basic readability - if you as a reviewer don't understand a sentence, probably others will have trouble too. Push back and ask questions about what they're really trying to say.
5. We don't generally merge a docs PR until the related code is released. Prebid.js releases happen on Weds or Thurs, and people really like to have their docs PRs merged shortly after the code is released. For Prebid Server, it's ok to merge the docs after the code is merged.
6. Fix broken or out-of-date things you run across. At least flag it in the team slack channel so we can fix it someday.
7. Bid Adapter Guidelines
    1. Check the front-matter: required fields are title and either pbjs or pbs.
    2. Every adapter needs a parameters table that contains exactly 5 columns in this order: Name, Scope, Description, Example, Type.
    3. Discourage full-page HTML examples. Better to have just the bidder-specific logic and a pointer to a standard Prebid.js example.
    4. All headers must be level 3, 4, or 5.

## Core Technologies

The Prebid website is developed using [GitHub pages](https://pages.github.com/) and [Jekyll](https://jekyllrb.com/), a static site generator which uses the following technology to create and style HTML pages. See the [main README file](https://github.com/prebid/prebid.github.io/blob/master/README.md) for instructions on how to set this up.

**Markdown**: The majority of the content is written in Markdown language. Jekyll transform this into raw HTML.

Learn more about Markdown](https://www.markdownguide.org/)

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

The _config.yml file (note underscore prefix) sets the base configuration for the site. Refer to [Jekyll](https://jekyllrb.com/docs/configuration/) documentation on which properties can be set in the _config.yml file.

***

## Directory Structure

Jekyll requires adherence to a certain directory structure to generate the site. Directories prefixed with an underscore contain files used to construct the html files of the site.

### File Construction

For the Prebid.org site the following directories are used:

**_data**  
Jekyll was originally designed specifically for creation of blogging websites and not for dynamic, data-driven sites. However, by including the _data directory we can mimic a database structure to create a more robust site. Files in this directory can be saved in either *json*, *yml* or *csv* format. For Prebid.org they have been saved in *yml*.

Learn more about YML [here](https://yaml.org/start.html)

There are several YML files in the Prebid _data directory

- [dropdown_v2](#Dropdown)
- [sidebar](#Sidebar)
- [messages](#Messages)
- [partners](#Partners)

The contents of these files are used throughout the Prebid.org site for dynamically creating the navigation and displaying messages. See the [Data Model](#data-models) section for a review of how the data is structured and to see sample code.


**_layouts**  

The layout directory contains HTML files that, in conjunction with CSS and JS files, format the layout of pages throughout the site.

**_includes**

The includes directory contains HTML files that can be included within files, such as a file for the header and footer.

**_bidders**

The bidders directory is not a standard part of Jekyll; it’s a special use directory specifically for the Prebid.org site. The files in this directory are used to construct the table of partners on the partners/partners.html page.

**_sites**

The sites directory is created by Jekyll. It contains the live site generated from the collected files and data listed above, combined with the CSS, JS and image assets and the Markdown files for individual pages.


***

## Assets

The assets directory contains the CSS, Javascript, images and other assets used to create the site.

The base CSS file used is Bootstrap (version 3.7.1) Custom CSS and modifications to Bootstrap classes are contained in the style.css file.

The JS directory contains the Javascript files required for the Prebid.org site. It includes JQuery and Bootstrap javascript frameworks as well as other third party libraries and custom javascript written specifically for the Prebid site. For JQuery and Bootstrap both the expanded and minified versions of the javascript files are included but only the minified files are linked from the site header.


#### CSS

1. Styles all come from /assets/css/main-bundle.css
1. These are generated from /_assets/sass
1. To make a change, edit the relevant sass file
1. Generate the css file from sass with 'npm run dev/prod'
1. Commit all the changes including assets/css/main-bundle.css
1. the _assets directory is not part of the _site tree

## Data Models

The data files are stored in the __data directory.

<a name="Dropdown></a>

### Dropdown

The dropdown_v2 YML file is used to construct the top nav when the site is viewed on desktops and tablets.

The YML map is divided into collections of menu sections. Menu sections are commented when they begin, for example;

```Markdown
#----------Product SubNav------------
```

Each menu item is represented in the YML map as a collection of key value pairs and begins with a dash (-) symbol. An indented collection indicates it is a child of the collection above it. Example:

```Markdown
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
*Note: A collection does not have to contain all properties. For Bools 1 = true, 0 = false*

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
This data file is read in the nav.html file using Liquid. (__includes/nav.html).

<a name="Sidebar></a>

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
*Note: A collection does not have to contain all properties. For bools 1 = true, 0 = false**

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
This data file is read in the page_v2.html file using Liquid.

**Code Use**  
This data file is read in the home.html file using Liquid.

## Bidder Files

There are 200+ bidder files in the /dev-docs/bidders directory describing the parameters for each Prebid.js bidder. There are two unfortunately identical pieces of code that process them:

- /\_layouts/bidder.html - this is used to generate the single-bidder version of the page like https://prebid.org/dev-docs/bidders/rubicon.html
- /dev-docs/bidders.md - this is used to generate the (large) combined page at https://prebid.org/dev-docs/bidders.html

The attributes in the Jekyll 'front matter' drive various behaviors and dynamic tables elsewhere on the site.

| Key | Required? | Values | Use |
| ----- | ------ | ------ | ------ |
| layout | yes | bidder | Links this file to the bidder.html layout |
| title | yes | company name | For display |
| pbjs | sorta | true or false | defines whether this is a Prebid.js bidder |
| pbs | sorta | true or false | defines whether this is a Prebid Server bidder |
| description | no | - | Not used |
| biddercode | yes | preferred bidder code | Used as the default ad server targeting suffix and the default download filename |
| aliasCode | no | download filename | Overrides the filename used to build the PBJS package on the download page |
| prevBiddercode | no | secondary bidder code | Adds a note about an alternate code that may have been used. |
| pbjs_version_notes | no | string | Displays on the download page |
| ANYTHING ELSE | no | string | There are many pieces of metadata (e.g. GDPR support, user IDs supported) that bid adapters can disclose. They're displayed on the bidder's parameter page. |

The bidderCode, aliasCode, and prevBiddercode parameters bear some description.
Some adapters have a longer bidderCode and a shorter bidderCode -- their adapter supports both (with the `alias` feature) but
there's only one documentation file and of course one PBJS adapter file. An relatively common scenario is when the company started off with a
long bidderCode, but found it awkward to set up ad server targeting variables because GAM limits you to 20 chars, which is easy to exceed
with a prefix like `hb_cache_host`. So they wanted to have shorter bidderCode for new customers while supporting the legacy targeting variables. In that scenario, they:

1) add the shorter code as an alias in their PBJS file, which can stay the old longer name
2) change the biddercode to the shorter name as it's the new preferred code
3) add aliasCode so the Download page will pull in the right module
4) optionally add prevBiddercode to add a note to the page about the legacy value

## Algolia Search

We use Algolia for site search. 

- The configuration defining the search parameters is at https://github.com/algolia/docsearch-configs/blob/master/configs/prebid.json
- Only elements p, th, td, li, code, and h1-h3 are indexed
- Code implementation in _includes/body-end.html and a the 'site-search' div in the header.
