---
layout: page_v2
title: Reconciliation SDK Module
description: Reconciliation Real Time Data Module
page_type: module
module_type: rtd
module_code: reconciliationRtdProvider
display_name: Reconciliation Supply Chain Validation
enable_download: true
vendor_specific: true
sidebarType: 1
---

# Reconciliation SDK Module

{:.no_toc}

* TOC
{:toc}

## Overview

The purpose of Reconciliation Real Time Data Provider is to allow publishers to collect supply chain structure information and vendor-specific impression IDs from ad creative suppliers. It reports the data to the Reconciliation Service, allowing publishers, advertisers and other supply chain participants to match and reconcile ad server, SSP, DSP and verification system log file records.
Reconciliation SDK was created as part of TAG DLT initiative ([https://www.tagtoday.net/pressreleases/dlt_9_7_2020](https://www.tagtoday.net/pressreleases/dlt_9_7_2020)).
TAG recently led a twelve-month, cross-industry pilot in the UK that evaluated the feasibility and benefits of using Distributed Ledger Technology (DLT) to increase trust and transparency in digital advertising.

More information: <https://www.tagtoday.net/brand-safety#dltnetwork>
Contact us: <consultation@tagtoday.net>

Implementation works like this:

1. Build the Reconciliation module into the Prebid.js package with:

    ```bash
    gulp build --modules=reconciliationRtdProvider&...
    ```

2. Use `setConfig` to pass parameters to module

## Configuration

This module is configured as part of the `realTimeData.dataProviders` object:

```javascript
pbjs.setConfig({
    "realTimeData": {
        dataProviders:[{          
            name: "reconciliation",
            params: {
                publisherMemberId: "test_prebid_publisher",
                allowAccess: true, //optional - false by default
            }
        }]
    }
});
```

Syntax details:

{: .table .table-bordered .table-striped }
| Name  |Type | Description   | Notes  |
| :------------ | :------------ | :------------ |:------------ |
| name  | String | Real time data module name | Always 'reconciliation' |
| params  | Object   | |   |
| params.publisherMemberId  |String   |Unique Publisher ID|   |
| params.allowAccess  |Boolean   |Share AdUnit IDs with advertiser Reconciliation Tags| Optional. Default to `false`|

## Output

For each ad slot, the module returns custom targeting values used to match impressions (publisher-adserver-advertiser).
The module also tracks AdUnit initialization and impressions ('impression' message is sent by the Reconciliation Tag in ad markup).

Custom targetings example:

```json
{
  "slotA":{
      "RSDK_AUID": "/slotA-Unit",
      "RSDK_ADID": "b5bbc103-00e9-499d-9637-bdba05b65427"
  },
  "slotB":{
      "RSDK_AUID": "/slotB-Unit",
      "RSDK_ADID": "325da95e-e37d-45fa-a46f-8ff91168b121"
  }
}
```
