---
layout: page_v2
title: iOS Logging & Troubleshooting
description: iOS Logging & Troubleshooting
sidebarType: 2
---

{% capture warningNote %}
This document describes a pre-release version of the Prebid Mobile API that has been deprecated. 
{% endcapture %}

{% include alerts/alert_warning.html content=warningNote %}

# iOS Logging & Troubleshooting
{:.no_toc}

To add Prebid Mobile logs for troubleshooting or to see successful bids simply import `PBLogging.h` and add the following code:

```objc
[PBLogManager setPBLogLevel:PBLogLevelInfo];
```

The following log level options are available:

- PBLogLevelAll
- PBLogLevelOff (Disable all logging)
- PBLogLevelTrace
- PBLogLevelDebug
- PBLogLevelInfo
- PBLogLevelWarn (Default)
- PBLogLevelError

Setting any log level other than `PBLogLevelAll` or `PBLogLevelOff` will enable all logging in the list at and below the level being set. For example, setting `PBLogLevelInfo` will enable logging for `PBLogLevelInfo`, `PBLogLevelWarn`, and `PBLogLevelWarn`.

# FAQs

**Q:** *I've defined a banner size as fluid in Google Ad Manager SDK (`AdSize(-3,-4)`), why am I receiving an empty response?*

**A:** Prebid Mobile does not support fluid size.


