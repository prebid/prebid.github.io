---
layout: page_v2
page_type: module
title: Module - First Party Data Enrichment
description: Adds standard first party data fields
module_code : firstPartyData
display_name : First Party Data
enable_download : true
sidebarType : 1
---

# First Party Data Enrichment Module
{:.no_toc}

## Overview

This module sets a number of First Party Data (FPD) values that are available from
the page environment.
The idea is to make the header bidding auction richer, which can help improve bid rates.

How it works: when the first auction on the page is run, this module merges a number of values into the `ortb2` object. Specific details below.

If the publisher needs to refresh the enriched FPD after the first auction, this can be done using the function:

```
pbjs.refreshFpd();
```

## First Party Data Fields Added

Here are the fields that this module adds to the ortb2 object:

{: .table .table-bordered .table-striped }
| Page Source | Ortb2 field | Notes |
|---+---+---|
| page URL | site.page | Uses pbjs getRefererInfo().canonicalUrl |
| referer URL | site.ref | Uses pbjs getRefererInfo().referer |
| domain | site.domain | Pulled from the getRefererInfo().canonicalUrl, the host domain is used, with www dropped. |
| viewport width | device.w | Hunts for window.innerWidth, window.document.documentElement.clientWidth, window.document.body.clientWidth |
| viewport height | device.w | Hunts for window.innerHeight, window.document.documentElement.clientHeight, window.document.body.clientHeight |
| meta keywords | site.keywords | Looks for a meta tag with name=keywords |


# Further Reading
- [First Party Data](/features/firstPartyData.html)
