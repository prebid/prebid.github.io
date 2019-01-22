---
layout: page_v2
title: About Prebid.js
description: How prebid.js was started and what is it about
pid: 60
isNew: false
hide: true
isNavParent: true
sidebarType: 0
---

# Prebid Website Maintenance Guide

v 1.0  
Janurary 7, 2019

***

## Core Technologies

The Prebid website is developed using [Jekyll](https://jekyllrb.com/), a static site generator which uses the following technology to create and style HTML pages. 

**Markdown**: The majority of the content is written in Markdown language. Jekyll transform this into raw HTML. 

Learn more about Markdown](https://www.markdownguide.org/)

**Bootstrap**: A CSS template for responsive site design. Bootstrap provides the base formatting for the site. 

Learn more about [Bootstrap](https://getbootstrap.com/docs/4.1/getting-started/introduction/_)

**Liquid**: A language created by Shopify to enable dynamic HTML creation. 

Learn more about [Liquid](https://help.shopify.com/en/themes/liquid/basics)

**Javascript**: A combination of Javascript libraries are utilized for the Prebid site to include [JQuery](https://jquery.com/) and [BootstrapJS](https://getbootstrap.com/docs/3.3/javascript/) as well as custom code. 

**CSS**: The site builds on the base Bootstrap template with custom CSS stored in the style.css file. 

***

## Site Config

The _config.yml file (note underscore prefix) sets the base configuration for the site. Refer to [Jekyll](https://jekyllrb.com/docs/configuration/) documentation on which properties can be set in the _congig.yml file. 

***

## Directory Structure

Jekyll requires adherence to a certain directory structure to generate the site. Directories prefixed with an underscore contain files used to construct the html files of the site. 

### File Construction

For the Prebid.org site the following directories are used: 

**_data**  
Jekyll was originally designed specifically for creation of blogging websites and not for dynamic, data-driven sites. However, by including the _data directory we can mimic a database structure to create a more robust site. Files in this directory can be saved in either *json*, *yml* or *csv* format. For Prebid.org they have been saved in *yml*.

Learn more about YML [here](https://yaml.org/start.html)

There are three YML files in the Prebid _data directory

- [dropdown_v2](#Dropdown)
- [sidebar](#Sidebar)
- [messages](#Messages)

The contents of these files are used throughout the Prebid.org site for dynamically creating the navigation and displaying messages. See the [Data Model](#data-models) section for a review of how the data is structured and to see sample code.


**_layouts**  

The layout directory contains HTML files that, in conjunction with CSS and JS files, format the layout of pages throughout the site. 

**_includes**

The includes directory contains HTML files that can be included within files, such as a file for the header and footer. 

**_posts**  

The posts directory contains the files that make up the content of the blog section of the site. Unlike the layouts and includes directories, the posts files are written in Markdown. A blog.html file in the layout directory provides the formatting for these Markdown files. 

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

**style.css**

This file contains custom CSS classes and modifications to Bootstrap classes. The file is broken up into the various sections relating to navigaton, homepage and content pages.

*Navbar*  
The navbar class is a Bootstrap class. It controls the formatting of the top level navigation. Portions of it have been modified specifically for Prebid formatting. 

*Dropdown*  
The dropdown class is a Boostrap class. It controls the formatting and functionality of the dropdown items of the top navigation. Portions of it have been modified specifically for Prebid formatting.

*Sidebar*  
The sidebar class is a Boostrap class. It controls the formatting and functionality of the dropdown items of the top navigation. Portions of it have been modified specifically for Prebid formatting. Additional custom classes have been created for specific formatting or functionality required by Prebid. 

*Homepage*  
The classes in the homepage secton are custom classes created to format the top portion of the Prebid website homepage. 

*Container*  
A custom container class created for the Prebid website. 

*Hover Effect*  
A custom series of classes created to control the formatting functionalty of the icon buttons on the Prebid website homepage. 

*Message*
A custom series of classes created to control the formatting of the message box on the Prebid website homepage. 

*Benfits*
A custom series of classes created to control the formatting of the Benefits section of the Prebid website homepage. 

*Carousel*  
The carousel class is a Bootstrap class. It controls the formatting and functionality of the carousel displayed on the homepage. Portions of it have been modified specifically for Prebid formatting. Additional custom classes have been created for specific formatting or functionality required by Prebid. 

*Partners*  
A custom series of classes created to control the formatting of the [partners](http://prebid.org/partners/partners.html) page. 

*Blog*  
A custom series of classes created to control the formatting of the blog pages.

*Content Pages*  
A custom series of classes created to control the formatting of the content on the interior pages.

*Footer*  
A custom class created to control the formatting of the footer.

**Responsivenes**

The CSS file has multiple @media sections that handle the formatting of the website pages at specific screen widths. Those widths (in pixels) are:

| Width | Device | 
| --- | --- | 
| 1300 | Small browsers |
| 1024 | Large tablets e.g. iPadPro |
| 768 | Regular tablets e.g. iPads |
| 414 | Large phones e.g. iPhone 8 Plus |
| 375 | Newer phones e.g. iPhone X |
| 360 | Older phones e.g. Galaxy S5 |
| 320 | Very old phones e.g. iPhone 5 |


***

## Data Models

The data files are stored in the __data directory. 

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

### Sidebar

The sidebar YML file is used to construct the left side navigation when the site is viewed on desktops and tablets and the top navigation when views on phones. 

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

### Messages

The messsages YML file is used to construct the message displayed on the Prebid homepage. Each message is represented in the YML map as a collection of key value pairs, each collection is prefixed with a dash (-). 

```Markdown
- messageId: 1
  messageText: Prebid.org has a new look! See the <a href="/blog/updated-website">blog entry</a> for more info.
  messageCreateDt: 01_08_2019
```  

| Key | Type | Example | Use |
| ----- | ------ | ------ | ------ |
| messageId | int | 0 | A unique identifier for each message |
| messageText | string | A message | The displayed text. (Use HTML formatting for links.)  |
| messageCreateDt | string | 01_08_2019 | Date the message was created, for historical purposes. | 

**Code Use**  
This data file is read in the home.html file using Liquid.












