---
layout: page_v2
title: Prebid Mobile Guide to European Ad Inventory and Providing Notice, Transparency and Choice
description: European Ad Inventory Overview
pid: 2
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---




# Prebid Mobile Guide to European Ad Inventory and Providing Notice, Transparency and Choice

{% capture infoNote %}

  In order for publishers to meet their transparency, notice and choice/consent requirements under the GDPR and the existing ePrivacy Directive, Prebid Mobile supports the [IAB Europe Transparency & Consent Framework](http:///advertisingconsent.eu/) (the "Framework").  
  
  This is a reference for mobile app publishers using Prebid Mobile to surface notice, transparency and choice to end users located in the EEA and signal approved vendors and, where necessary, pass consent, to demand sources and their vendors.  
  
  This resource should not be construed as legal advice and Prebid.org make no guarantees about compliance with any law or regulation.  Please note that because every company and its collection, use, and storage of personal data is different, you should also seek independent legal advice relating to obligations under European regulations, including the GDPR and the existing ePrivacy Directive. Only a lawyer can provide you with legal advice specifically tailored to your situation. Nothing in this guide is intended to provide you with, or should be used as a substitute for, legal advice tailored to your business.  
    
{% endcapture %}

{% include alerts/alert_note.html content=infoNote %}

## Framework APIs

Prebid Mobile provides two APIs for app publishers to use the Framework. These APIs allow you to:

-   Define whether European privacy regulations should apply
-   Set the [IAB Europe](https://www.iabeurope.eu/) (IAB) consent string

This information will be persisted by Prebid Mobile and will be added to each ad call. Publishers/Consent Management Platforms (CMPs) are free to store these values in an NSUserDefaults/SharedPreferences interface (as defined by [Mobile In-App CMP API v1.0: Transparency & Consent Framework](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/Mobile%20In-App%20Consent%20APIs%20v1.0%20Final.md)) instead of passing them via the new APIs, and Prebid Mobile will read the values as a fallback.

Publishers are responsible for providing notice, transparency and choice and collecting consent from their users in accordance with [the Framework policies](http://advertisingconsent.eu/), either using their own CMP or working with a vendor.

-   [Register your own CMP](https://register.consensu.org/CMP)
-   [List of registered CMPs](https://advertisingconsent.eu/cmp-list/)

All vendor SDKs (including mediation SDKs) are responsible for looking up approved vendor and consent information on their own.

-   [iOS - Targeting Parameters](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
-   [Android - Targeting Parameters](/prebid-mobile/pbm-api/android/pbm-targeting-params-android.html)


