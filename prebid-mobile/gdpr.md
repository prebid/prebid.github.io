---
layout: page
title: GDPR Support
description: Set GDPR
pid: 1
top_nav_section: prebid-mobile
nav_section: prebid-mobile
---


<div class="bs-docs-section" markdown="1">

# GDPR Support

Prebid Mobile provides two APIs for app publishers to apply General Data Protection Regulation (GDPR) controls.

## GDPR APIs

The GDPR APIs allow you to:

-   Define whether GDPR should apply
-   Set the Interactive Advertising Bureau (IAB) consent string

This information will be persisted by Prebid Mobile and will be added to each ad call. Publishers/Consent Management Platforms (CMPs) are free to store these values in an NSUserDefaults/SharedPreferences interface (as defined by [Mobile In-App CMP API v1.0: Transparency & Consent Framework](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/Mobile%20In-App%20Consent%20APIs%20v1.0%20Draft%20for%20Public%20Comment.md)) instead of passing them via the new APIs, and Prebid Mobile will read the values as a fallback.

Publishers are responsible for collecting consent from their users independent of AppNexus, either using their own CMP or working with a vendor.

AppNexus will provide a version of CMP that a publisher can use only as a reference.

[Android GDPR API]({{site.github.url}}/prebid-mobile/targeting-params-android.html)

[iOS GDPR API]({{site.github.url}}/prebid-mobile/targeting-params-ios.html)


</div>
