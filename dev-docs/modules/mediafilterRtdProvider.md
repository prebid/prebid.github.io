---
layout: page_v2
title: The Media Trust Real-Time Ad Defense
display_name: The Media Trust Real-Time Ad Defense
description: Stop malware, redirects, scams, offensive ad content, heavy ads, and more from ruining your audience's experience.
page_type: module
module_type: rtd
module_code : mediafilterRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# The Media Trust Real-Time Ad Defense

## Overview

 As malvertising, scams, and controversial and offensive ad content proliferate across the digital media ecosystem, publishers need advanced controls to both shield audiences from malware attacks and ensure quality site experience. With the market’s fastest and most comprehensive real-time ad quality tool, The Media Trust empowers publisher Ad/Revenue Operations teams to block a wide range of malware, high-risk ad platforms, heavy ads, ads with sensitive or objectionable content, and custom lists (e.g., competitors). Customizable replacement code calls for a new ad to ensure impressions are still monetized.

[![IMAGE ALT TEXT](http://img.youtube.com/vi/VBHRiirge7s/0.jpg)](https://mediatrust.com/how-we-help/media-filter "The Media Filter")

{: .alert.alert-warning :}
To start using this module, please contact [The Media Trust](https://mediatrust.com/how-we-help/media-filter/ "The Media Trust") to get a script and configuration hash for module configuration.

## Integration

1. Build Prebid bundle with The Media Filter module included.  

    ```bash
    gulp build --modules=mediafilterRtdProvider
    ```

2. Inlcude the bundled script in your application.

# Configuration

Add configuration entry to `realTimeData.dataProviders` for The Media Filter module.

```javascript
pbjs.setConfig({
    realTimeData: {
        dataProviders: [{
            name: 'mediafilter',
            params: {
                configurationHash: '<configurationHash>',
            }
        }]
    }
});
```
