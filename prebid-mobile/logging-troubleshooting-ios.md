---
layout: page
title: Logging & Troubleshooting
description: Logging & Troubleshooting
pid: 2
top_nav_section: prebid-mobile
nav_section: prebid-mobile-ios
---

<div class="bs-docs-section" markdown="1">

# Logging & Troubleshooting
{:.no_toc}

To add Prebid Mobile logs for troubleshooting or to see successful bids simply import `PBLogging.h` and add the following code:

```objc
[PBLogManager setPBLogLevel:PBLogLevelInfo];
```

While you're testing your Prebid Mobile implementation, you can set your log level to `PBLogLevelAll` to help with troubleshooting. This setting not only provides logs, but it also puts your Prebid Mobile app into test mode and no impressions will be recorded. Be sure to remove this setting before going to production.

```objc
[PBLogManager setPBLogLevel:PBLogLevelAll];
```

The following log level options are available:

- PBLogLevelAll **\* Use ONLY for testing. \***
- PBLogLevelOff (Disable all logging)
- PBLogLevelTrace
- PBLogLevelDebug
- PBLogLevelInfo
- PBLogLevelWarn (Default)
- PBLogLevelError

Setting any log level other than `PBLogLevelAll` or `PBLogLevelOff` will enable all logging in the list at and below the level being set. For example, setting `PBLogLevelInfo` will enable logging for `PBLogLevelInfo`, `PBLogLevelWarn`, and `PBLogLevelWarn`.

# FAQs

**Q:** *I've defined a banner size as fluid in DFP SDK (`AdSize(-3,-4)`), why am I receiving an empty response?*

**A:** Prebid Mobile does not support fluid size.

***

**Q:** *My Prebid Mobile implementation is winning impressions, but they're not being recorded.*

**A:** Be sure you didn't leave your log level setting in test mode. A setting of `PBLogLevelAll` assumes you're testing your Prebid Mobile app, so winning impressions will not be recorded.

</div>
