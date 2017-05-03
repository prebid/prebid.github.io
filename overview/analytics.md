---
layout: page
title: Analytics Overview
description: Prebid.js Analytics Overview

pid: 10

top_nav_section: overview
nav_section: analytics

---
<div class="bs-docs-section" markdown="1">
# Analytics for Prebid

There are several analytics adapter plugins available to track header bidding performance for your site.

## Self-Serve Analytics

If you've installed Prebid on your own, these are the options for plugging in reporting. Note that none of them are endorsed or supported by Prebid.org.

#### [Google Analytics](/overview/ga-analytics.html)

Provided by the open source team as a basic approach to get header bidding stats. It assumes you've already signed up for a Google Analytics account - either free or paid.

#### [PrebidAnalytics by Roxot](http://prebidanalytics.com)

Roxot offers [prebidanalytics.com](http://prebidanalytics.com) as a free analytics service.


## Managed Services

There are several other analytics adapters available to publishers who work directly with a specific service provider.

For additional service and analytics options, you may contact:

* AppNexus (link or contact info)
* PulsePoint
* [RubiconProject](http://rubiconproject.com/headerbidding/)
* Sharethrough

## How it works

Each analytics provider has specific instructions for using their system, but these are the general steps:

* Create an account with the analytics vendor and obtain the necessary IDs
* Build the Prebid.js package with the vendor's analytics adapter
* Load analytics javascript from vendor directly on the page
* Call the pbjs.enableAnalytics() function
* Use the vendor's UI for reporting

This is an example call to pbjs.enableAnalytics():

```
pbjs.que.push(function() {
    pbjs.enableAnalytics({
        provider: 'NAME',
        options: {
            [...]
        }
    });
});
```

## More Details

* [Creating a new analytics adapter](/dev-docs/integrate-with-the-prebid-analytics-api.html)
</div>
