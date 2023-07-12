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

This module loads external code using the passed parameter (params.tagId).<br />
The reason for needing an external script is not just to acquire data from the current page, but also to analyze accumulated data periodically. Instead of using a version, the script is loaded based on the date for a specific reason. The A1Media script has many customizable elements for the deployed site. Therefore, there is an issue where the script needs to be changed immediately upon request from the site. By loading the script based on the date, it ensures that the script is refreshed within a maximum of one day.

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
                name: "a1Media",
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
| `params.tagId`     | String        | Publisher specific script name                             | yes       | 


{: .alert.alert-warning :}
tagId is publisher specific tag ID.
