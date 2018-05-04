---
layout: page
title: GDPR
description: Set GDPR
pid: 1
top_nav_section: prebid-mobile
nav_section: prebid-mobile-ios
---


<div class="bs-docs-section" markdown="1">

# GDPR


## GDPR Support

PrebidMobile(PBM) will provide two new APIs for app publishers

To define if the GDPR should apply and
To set the IAB consent string.

This information will be persisted by PBM and will be added to each ad call to apply GDPR controls. Publishers/CMPs are free to store these values in a NSUserDefault/SharedPreferences as defined by Mobile In-App CMP API v1.0: Transparency & Consent Framework instead of passing it via the new API's, and PBM will read the values as a fallback.

Publishers are responsible for collecting consent from their users independent of AppNexus, either using their own Consent Management Platform (CMP) or working with a vendor.

AppNexus will provide a version of CMP that a publisher can use as a reference only.

API's for the GPDR will be provided here


</div>
