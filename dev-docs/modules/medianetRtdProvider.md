---
layout: page_v2
title: Media.net Realtime Module
display_name: Media.net Realtime Module
description: Delivers added functionality based on configurations, i.e. refresh, viewability, etc.
page_type: module
module_type: rtd
module_code : medianetRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# Media.net Realtime Module
{:.no_toc}

* TOC 
{:toc}

## Overview

The module currently provisions Media.net's Intelligent Refresh configured by the publisher.

### Intelligent Refresh

Intelligent Refresh (IR) module lets publisher refresh their ad inventory without affecting page experience of visitors through configured criteria. The module optionally provides tracking of refresh inventory and appropriate targeting in GAM. Publisher configured criteria is fetched via an external JS payload.

{: .alert.alert-warning :}
Disclosure: This module loads external code that is not open source and has not been reviewed by Prebid.org.

## Configuration

This module is configured as part of the `realTimeData.dataProviders` object.

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description                            | Example       | Type     |
|------------|----------|----------------------------------------|---------------|----------|
| `name `     | required | Real time data module name | `'medianet'`   | `string` |
| `params`      | required |  | | `Object` |
| `params.cid`      | required | The customer id is provided by Media.net. | `'8CUX0H51C'` | `string` |

#### Basic Example

```javascript
pbjs.setConfig({
    realTimeData: {
        dataProviders: [{
            name: 'medianet',
            params: {
                cid: '8CUX0H51C'
            }
        }]
    }
});
```

## Prebid Adapters module usage

Prebid bidder and analytics adapters can read `adunit.ortb2Imp.ext.refresh` to know the information passed by Intelligent Refresh Real Time Module. Example AdUnit:

```javascript
var adUnit = {
  "code": "div-gpt-ad-1460505748561-1",
  // ...
  "ortb2Imp": {
    "ext": {
      "refresh": {   // added by Intelligent Refresh RTD
        "mnrf": "1", // mnrf=1 means its a refresh impression
        "mnrfc": 2   // mrfc=2 means its the 2nd refresh-ed impression
      },
      "data": { "pbadslot": "div-gpt-ad-1460505748561-1" },
    }
  }
};
```

## Targeting sent to GAM

For each prebid adUnit we pass following key values to GAM by default

```javascript
var targeting = {
  "slotA":{
      "mnadc": "slotA",   // used to map GPT slot => Prebid AdUnit
      "mnrf": "1",        // Refresh Impression Flag
      "mnrfc": 2          // Refreshed count per slot
  }
};
```

## Integration
To install the module, follow these instructions:

#### Step 1: Prepare the base Prebid file

- Option 1: Use Prebid [Download](/download.html) page to build the prebid package. Ensure that you do check *Media.net Realtime Module* module

- Option 2: From the command line, run `gulp build --modules=medianetRtdProvider,...`

#### Step 2: Set configuration

Enable Media.net Real Time Module using `pbjs.setConfig`

```javascript
pbjs.setConfig({
    realTimeData: {
        dataProviders: [{
            name: 'medianet',
            params: {
                cid: '8CUX0H51C'
            }
        }]
    }
});
```

