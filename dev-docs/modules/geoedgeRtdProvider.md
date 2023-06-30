---
layout: page_v2
title: Geoedge Realtime Module
display_name: Geoedge Realtime
description: Geoedge realtime blocking of bad ads - malware, redirect and offensive content
page_type: module
module_type: rtd
module_code : geoedgeRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# Geoedge Realtime Module

{:.no_toc}

* TOC
{:toc}

## Overview

The Geoedge Realtime module lets publishers block bad ads such as automatic redirects, malware, offensive creatives and landing pages.
To use this module, you'll need to work with [Geoedge](https://www.geoedge.com/publishers-real-time-protection/) to get an account and cutomer key.

{: .alert.alert-warning :}
Disclosure: This module loads external code that is not open source and has not been reviewed by Prebid.org.

## Integration

1. Build the geoedge RTD module into the Prebid.js package with:

    ```bash
    gulp build --modules=geoedgeRtdProvider,...
    ```

2. Use `setConfig` to instruct Prebid.js to initilize the geoedge module, as specified below.

## Configuration

This module is configured as part of the `realTimeData.dataProviders` object:

```javascript
pbjs.setConfig({
    realTimeData: {
        dataProviders: [{
            name: 'geoedge',
            params: {
                key: '123123',       // obtain your key from Geoedge support
                bidders: {
                    'bidderA': true, // monitor bids form this bidder
                    'bidderB': false // do not monitor bids form this bidder.
                },
                wap: true
            }
        }]
    }
});
```

Parameters details:

{: .table .table-bordered .table-striped }
|Name |Type |Description |Notes |
| :------------ | :------------ | :------------ |:------------ |
|name | String | Real time data module name |Required, always 'geoedge' |
|params | Object | | |
|params.key | String | Customer key |Required, contact Geoedge to get your key |
|params.bidders | Object | Bidders to monitor |Optional, list of bidder to include / exclude from monitoring. Omitting this will monitor bids from all bidders. |
|params.wap |Boolean |Wrap after preload |Optional, defaults to `false`. Set to `true` if you want to monitor only after the module has preloaded the monitoring client. |

## Example

To view an integration example:

1. in your cli run:

    ```bash
    gulp serve --modules=appnexusBidAdapter,geoedgeRtdProvider
    ```

2. in your browser, navigate to:

```text
http://localhost:9999/integrationExamples/gpt/geoedgeRtdProvider_example.html
```
