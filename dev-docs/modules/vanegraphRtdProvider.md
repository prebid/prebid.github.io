---
layout: page_v2
title: Vanegraph RTD Module
display_name: Vanegraph RTD Module
description: Contextual IAB Content Taxonomy 3.1 categories, brand-safety tier and reader intent for the current page, with no personal data.
page_type: module
module_type: rtd
module_code: vanegraphRtdProvider
enable_download: true
vendor_specific: true
sidebarType: 1
---

# Vanegraph RTD Module

{:.no_toc}

* TOC
{:toc}

## Overview

The Vanegraph RTD module adds contextual signals for the current page to every auction:

* IAB Content Taxonomy 3.1 categories in `ortb2.site.content.cat` with `cattax: 9`
* Segments in `ortb2.site.content.data` with `segtax` 9 (Content Taxonomy 3.1) and 6 (Content Taxonomy 2.2)
* Vendor segments for the brand-safety tier (`vg-safety-*`), risk categories (`vg-risk-*`), reader intent (`vg-intent-*`), commercial intent (`vg-commercial-*`) and the publisher's own audience segments (`vg-seg-*`)

It uses no personal data, sets no cookies and uses no browser storage. Pages are classified once and served from Vanegraph's cache. An unseen page is queued and gets labels on a later view, so the module never makes an auction wait for a model. Publishers can register their RSS feed so new articles are labelled before the first reader arrives.

Optionally, the module mirrors the labels as Google Ad Manager key-values (`vg_cat`, `vg_safety`, `vg_intent`, `vg_seg`) for direct-sold line items.

Accuracy is published per language at [vanegraph.com](https://vanegraph.com/#benchmark).

## Integration

1. Create a publishable key (`pk_…`) locked to your domains on the [Vanegraph dashboard](https://vanegraph.com/dashboard). Publishable keys only work for the listed domains and only read labels, so they are safe in page code.
2. Build Prebid.js with the RTD core module and this submodule:

    ```bash
    gulp build --modules=rtdModule,vanegraphRtdProvider,...
    ```

3. Configure it:

    ```javascript
    pbjs.setConfig({
      realTimeData: {
        auctionDelay: 150,
        dataProviders: [{
          name: 'vanegraph',
          waitForIt: true,
          params: {
            publishableKey: 'pk_...',
            setGptTargeting: true
          }
        }]
      }
    });
    ```

## Parameters

{: .table .table-bordered .table-striped }
| Name | Type | Description | Default |
| :--- | :--- | :--- | :--- |
| `name` | String | Always `vanegraph` | required |
| `params.publishableKey` | String | Publishable key (`pk_…`) | required |
| `params.url` | String | Page URL to look up | current page |
| `params.setGptTargeting` | Boolean | Also set Google Ad Manager key-values | `true` |
| `params.endpoint` | String | API endpoint override | `https://api.vanegraph.com/v1/rtd` |

## Contact

[hello@vanegraph.com](mailto:hello@vanegraph.com)
