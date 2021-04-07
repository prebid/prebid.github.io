---
layout: page_v2
title: Android Logging & Troubleshooting
description: Android Logging & Troubleshooting
sidebarType: 2
---

{% capture warningNote %}
This document describes a pre-release version of the Prebid Mobile API that has been deprecated. 
{% endcapture %}

{% include alerts/alert_warning.html content=warningNote %}

# Android Logging & Troubleshooting
{:.no_toc}

Troubleshoot your Prebid Mobile integration by following these steps to check your application logs.

1. With your test device connected to the computer, run the following command in your terminal:
```adb shell setprop log.tag.PrebidMobile VERBOSE```

2. Navigate to the Android Monitor in Android Studio.

3. In the logcat tab, set the Log Level to Verbose and search for "PrebidMobile". You should see a list of logs.

## FAQs

**Q:** I've defined a banner size as fluid in Google Ad Manager SDK (`AdSize(-3,-4)`), why am I receiving an empty response?

**A:** Prebid Mobile does not support fluid size.


