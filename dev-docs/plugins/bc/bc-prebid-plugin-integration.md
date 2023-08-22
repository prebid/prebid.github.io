---
layout: page_v2
title: How to Integrate and Configure Prebid Plugin for Brightcove (Videojs) Player
description: Ad Unit Reference
top_nav_section: dev_docs
nav_section: plugins
pid: 10
---



# How to Integrate and Configure Prebid Plugin for Brightcove (Videojs) Player

## Overview

There are two different styles of integrating the Brightcove Prebid Plugin with the Brightcove Player:

* dynamically, directly on the publisher page
* statically, directly in Brightcove Studio

Your choice of integration method depends on how you want to run prebid and manage the plugin.

## Dynamic Integration - Integrating the Plugin Directly on the Page

Publishers can integrate the Plugin directly on the page.  This method is required when you are requesting that the plugin run prebid in the header, before the Brightcove Player is loaded.

### Advantages (dynamic)

* Publisher has more control over when and how prebid is executed.
* This method allows the publisher to run prebid in the header, either via the plugin or using their own code.
* Publishers can directly interact with the plugin using the Brightcove Prebid Plugin API.

### Disadvantages (dynamic)

* Publisher has to maintain more code on the page.  The publisher can use an external Javascript file to define options to predbid but this script must be loaded by the page.

### Caveats

* Publisher needs to manage cross-domain iframe issues.

Visit [Brightcove Prebid Plugin Dynamic Integration]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-integration-dynamic.html) for details on how to dynamically integrate the plugin on the publisher page.

## Integration Directly in Brightcove Studio

Publishers can integrate the Plugin via Brightcove Player Studio.  Using this method reduces the amount of code needed on the publisher page.  However, you then must run prebid "just-in-time" when the player is being loaded.

### Advantages (direct)

* Publishers can define all the options that are being passed into the Studio so that no additional code needs to be added to the publisher page except for the player embed code provided by the Studio.
* Publishers can manage and modify prebid options without having to modify their page.
* Cross domain iframe issues can be avoided.

### Disadvantages (direct)

* Publishers are unable to run prebid in the header of the page since the plugin will not be present until the player is loaded
* Publishers may have limited ability to use the Brightcove Prebid Plugin API

Visit [Brightcove Prebid Plugin - Integration via Brightcove Studio]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-integration-studio.html) for details how to integrate the plugin via Brightcove Player Studio.

## Plugin API

**[Brightcove Prebid Plugin API]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-api.html)**

## Plugin Options

**[Options Supported by Brightcove Prebid Plugin]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-options.html)**
