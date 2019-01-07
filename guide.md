# Prebid Website Maintenance Guide

v 1.0  
November 26, 2018

***

## Core Technologies

The Prebid website is developed using Jekyll, a static site generator which uses the following technology to create and style HTML pages. 

**Markdown**: The majority of the content is written in Markdown language. Jekyll transform this into raw HTML. 

Learn more about Markdown [here](https://www.markdownguide.org/)

**Bootstrap**: A CSS template for responsive site design. Bootstrap provides the base formatting for the site. 

Learn more about Bootstrap [here](https://getbootstrap.com/docs/4.1/getting-started/introduction/_)

**Liquid**: A language created by Shopify to enable dynamic HTML creation. 

Learn more about Liquid [here](https://help.shopify.com/en/themes/liquid/basics)

**Javascript**: A combination of Javascript libraries are utilized for the Prebid site to include [JQuery](https://jquery.com/) and [BootstrapJS](https://getbootstrap.com/docs/3.3/javascript/) as well as custom code. 

**CSS**: The site builds on the base Bootstrap template with custom CSS stored in the style.css file. 

Learn more about Jekyll [here](https://jekyllrb.com/)

***

## Site Config

The _config.yml file (note underscore prefix) sets the base configuration for the site. 

***

## Directory Structure

Jekyll requires adherence to a certain directory structure in order to generate the site. Directories prefixed with an underscore contain files used to construct the site. For the Prebid site the following directories are used for its construction: 

**_data**  

Jekyll designed specifically for blogging and not as a dynamic, data driven site. The data directory provides some ability to mimic a database struture. Files in this directory can be saved in either *json*, *yml* or *csv* format. For Prebid they have been saved in *yml*. 

Learn more about YML [here](https://yaml.org/start.html)

There are three yml files in the Prebid _data directory

- dropdown_v2
- sidebar
- partners

The contents of these files are used in the Prebid site as key/value collections. 

See the **Data Structure** section for a review on how the data is structured and sample code. 

**_layouts**  

The layout directory contains HTML files that, in conjunction with CSS and JS files, format the layout of pages throughout the site. 

**_includes**

The includes directory contains HTML files that can be included within layout files, such as a file for the header and footer. 

**_posts**  

The posts directory contains the files that are the content of the blog section of the site. Unlike the layouts and includes directories, the posts files are written in Markdown. A blog.html file in the layout directory provides the formatting for these Markdown files. 

**_bidders** 

The bidders directory is a special use directory specifically for the Prebid site. In the _config.yml file there is a collections key, the value for this key represents directories whose contents are automatically generated into a key/value collection. It is similar to the data directory except each file represents one entry in the collection.

**_sites**

The sites directory is created by Jekyll. It contains the live site generated from the collected files and data listed above, combined with the CSS, JS and image assets and the Markdown files for individual pages. 

***

## Assets

The assets directory contains the CSS, Javascript, images and other assets used to create the site. 

The base CSS file used is Bootstrap (version 3.7.1) Custome CSS and modifications to Bootstrap classes are contained in the style.css file. 

There are several Javascript files, both expanded and minified versions of JQuery and Bootstrap JS files are included in the assets directory, though the site only includes the minified versions in the header. 

***

## Data Structures

**_dropdown_v2**

The dropdown_v2 yml file is used to construct the top nav when the site is viewed on desktops and tablets. The yml is divided into menu sections. Menu sections are commented when they begin, for example; 

#----------Product SubNav------------

Each menu item is represented in the yml map as a collection of key value pairs and begins with a dash (-) symbol. An indented collection indicates it is a child of the collection above it. Example: 

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

the collection with the title property "What Is Prebid?" is a child of the collection directly above it with the sectionName "Overview"

**Top Nav Menu Properties**  
*Note: A collection does not have to contain all properties.*

| Key | Type | Example | Use |
| --- | --- | --- | --- | --- |
sectionId |  int | 0  | Indicates the menu section of an item.
sectionName |  string | Overview  | The display name of the section. 
link |  string | /overview/intro.html  | The relative link that the menu item should open. 
isHeader | bool | 1 | Indicates if this item is a section header. 
hasSubMenus | bool | 1 | Indicates if this item has submenus. 
submenus | collection | | If the item has submenus they will be contained in a collection of collections. 
subsectionId | int | 0 | Indicates the subsection of an item. 
needsDivider | bool | 0 | Indicates if the subsection item is the last item in the section and requires a divider. **Deprecated**
isSubsectionStart | bool | 0 | Indicates if the item is the start of a subsection. **Deprecated**

**Code Use**  
This data file is read in the nav.html file using Liquid. (__includes/nav.html). 










