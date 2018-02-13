---
layout: bidder
title: Invibes
description: Prebid Invibes Bidder Adaptor
top_nav_section: dev_docs
nav_section: reference
hide: true
biddercode: invibes
biddercode_longer_than_12: false
prebid_1_0_supported : false
---

### bid params

{: .table .table-bordered .table-striped } 

| Name           | Scope    | Description                                | Example                                            |
| :------------- | :------- | :----------------------------------------- | :------------------------------------------------- |
| placementId    | required | The Invibes placement ID                   | `"1234567"`                                        |
| customEndpoint | optional | The bid endpoint (might be used for debug) | `"https://static.r66net.com/bid/testEndpoint.js"`  |
| adContainerId  | optional | Id of ad container                         | `"test-div"`                                       |
| loginId        | optional | Login Id                                   | `"5qCteKJl0wfiyQ5DEplh"`                           |
