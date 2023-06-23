---
layout: page_v2
title: A1Media RTD Module
display_name: A1Media RTD Module
description: A1Media Real Time Data Module
page_type: module
module_type: rtd
module_code : a1MediaRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# A1Media RTD Module
{:.no_toc}

* TOC
{:toc}

{: .alert.alert-warning :}
Disclosure: This module loads external code that is not open source and has not been reviewed by Prebid.org.

## Integration

1) Build the A1Media RTD Module into the Prebid.js package with:

```
gulp build --modules=a1MediaRtdProvider,...
```

2) Use `setConfig` to instruct Prebid.js to initilaize the A1Media RTD module, as specified below.

## Configuration

```javascript
pbjs.setConfig({
    realTimeData: {
        auctionDelay: 1000,
        dataProviders: [
            {
                name: "a1MediaRtdProvider",
                waitForIt: true,
                params: {
                    // 'tagId' is unique value for each account.
                    tagId: 'lb4test'
                }
            }
        ]
    }
});
```

## Parameters

{: .table .table-bordered .table-striped }
| Name             |Type           | Description                                                         |Required | Notes  |
| :--------------- | :------------ | :------------------------------------------------------------------ |:---------|:------------ |
| `name`           | String        | Real time data module name                                          | yes     | Always 'a1Media' |
| `waitForIt`      | Boolean       | Should be `true` if there's an `auctionDelay` defined (recommended) | no      | Default `false` |
| `params`         | Object        | |  | |
| `params.tagId`     | String        | Publisher specific script name                             | no       | Defaults to `https://live-classification.cpx.to/prebid-segments`


{: .alert.alert-warning :}
tagId is publisher specific script name ...
