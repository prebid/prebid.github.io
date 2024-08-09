---
layout: page_v2
title: Lucead RTD
display_name: Lucead RTD
description: This module is a mandatory part of Lucead and Adlive Plus adapters integration.
page_type: module
module_type: rtd
module_code : luceadRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# Lucead RTD Provider

{% include dev-docs/loads-external-javascript.md %}

## Overview

Module Name: Lucead Rtd Provider

Module Type: Rtd Provider

Maintainer: [prebid@lucead.com](mailto:prebid@lucead.com)

## Description

The official Lucead Rtd Provider module for Prebid.js.

This module allows bidders to improve their targeting capabilities using the Lucead cookieless solutions.

## Configuration

Replace the `siteId` param with the site id provided by Lucead.

Replace the `bidders` param with the bidders you want to work with.

```javascript
pbjs.setConfig({
    realTimeData: {
        dataProviders: [
            {
                name: 'lucead',
                waitForIt: true,
                params: {
                    siteId: '1',
                    bidders: ['improvedigital', 'smartadserver', 'adliveplus'],
                }
            },
        ]
    }
});
```
