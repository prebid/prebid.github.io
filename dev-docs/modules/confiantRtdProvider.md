---
layout: page_v2
title: Confiant Real-Time Data Provider
display_name: Confiant Real-Time Protection Module
description: Confiant Real-Time detection and blocking of bad ads to protect your users and brand reputation
page_type: module
module_type: rtd
module_code : confiantRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# Confiant Real-Time Protection Module

## Overview

Confiant’s module provides comprehensive detection of security, quality, and privacy threats across your ad stack.
Confiant is the industry leader in real-time detecting and blocking of bad ads when it comes to protecting your users and brand reputation.

To start using this module, please contact [Confiant](https://www.confiant.com/contact) to get an account and customer key.

{: .alert.alert-warning :}
Disclosure: When configured, this module will insert a script, that is loaded from Confiant's CDN and has proprietary code.

## Integration

1) Build Prebid bundle with Confiant module included:

```
gulp build --modules=confiantRtdProvider,...
```

2) Include the resulting bundle on your page.

# Configuration

Configuration of Confiant module is plain simple:

```javascript
pbjs.setConfig({
    realTimeData: {
        dataProviders: [{
            name: 'confiant',
            params: {
                // so please get in touch with us so we could help you to set up the module with proper parameters
                propertyId: '', // required, string param, obtained from Confiant Inc.
                prebidExcludeBidders: '', // optional, comma separated list of bidders to exclude from Confiant's prebid.js integration
                prebidNameSpace: '', // optional, string param, namespace for prebid.js integration
                shouldEmitBillableEvent: false, // optional, boolean param, upon being set to true enables firing of the BillableEvent upon Confiant's impression scanning
            }
        }]
    }
});
```
