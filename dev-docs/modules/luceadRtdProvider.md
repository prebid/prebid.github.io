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

This module is a mandatory part of the Lucead Bid Adapter integration.

Please contact [prebid@lucead.com](prebid@lucead.com) for more information.

Maintainer: [lucead.com](https://www.lucead.com/)

## Integration

* Compile the Lucead RTD module (`luceadRtdProvider`) into your Prebid build,
along with the parent RTD Module (`rtdModule`):

```bash
gulp build --modules=rtdModule,luceadRtdProvider,luceadBidAdapter
```

* Set configuration via `pbjs.setConfig`.

```javascript
pbjs.setConfig({
    realTimeData: {
        dataProviders: [
            {name: 'lucead', waitForIt: true},
        ]
    }
});
```
