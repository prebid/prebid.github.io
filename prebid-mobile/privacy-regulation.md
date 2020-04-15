---
layout: page_v2
title: Prebid Mobile Guide to Privacy Regulation
description: Privacy Regulation Overview
pid: 2
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---

# Prebid Mobile Guide to Privacy Regulation

{:.no_toc}

{% capture legalNotice %}

  This resource should not be construed as legal advice and Prebid.org make no guarantees about compliance with any law or regulation.  Please note that because every company and its collection, use, and storage of personal data is different, you should also seek independent legal advice relating to obligations under European and /or US regulations, including the GDPR, the existing ePrivacy Directive and CCPA. Only a lawyer can provide you with legal advice specifically tailored to your situation. Nothing in this guide is intended to provide you with, or should be used as a substitute for, legal advice tailored to your business.
  {% endcapture %}

{% include /alerts/alert_important.html content=legalNotice %}

* TOC
{:toc}

## Prebid Mobile Guide to European Ad Inventory and Providing Notice, Transparency and Choice (GDPR)

{% capture gdprNote %}

  In order for publishers to meet their transparency, notice and choice/consent requirements under the GDPR and the existing ePrivacy Directive, Prebid Mobile supports the [IAB Europe Transparency & Consent Framework](https://www.iab.com/topics/consumer-privacy/gdpr/) (the "Framework").  

  This is a reference for mobile app publishers using Prebid Mobile to surface notice, transparency and choice to end users located in the EEA and signal approved vendors and, where necessary, pass consent, to demand sources and their vendors.  


{% endcapture %}

{% include alerts/alert_note.html content=gdprNote %}

### Framework APIs

Prebid Mobile provides two APIs for app publishers to use with the Framework. These APIs allow you to:

-   Define whether European privacy regulations should apply
-   Set the [IAB Europe](https://www.iabeurope.eu/) (IAB) consent string

This information will be persisted by Prebid Mobile and will be added to each ad call. Publishers/Consent Management Platforms (CMPs) are free to store these values in an `NSUserDefaults/SharedPreferences` interface (as defined by [Mobile In-App CMP API v1.0: Transparency & Consent Framework](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/Mobile%20In-App%20Consent%20APIs%20v1.0%20Final.md)) instead of passing them via the new APIs, and Prebid Mobile will read the values as a fallback.

Publishers are responsible for providing notice, transparency and choice and collecting consent from their users in accordance with [the Framework policies](https://www.iab.com/topics/consumer-privacy/gdpr/), either using their own CMP or working with a vendor.

-   [Register your own CMP](https://register.consensu.org/CMP)
-   [List of registered CMPs](https://iabeurope.eu/cmp-list/)

All vendor SDKs (including mediation SDKs) are responsible for looking up approved vendor and consent information on their own.

-   [iOS - Targeting Parameters](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
-   [Android - Targeting Parameters](/prebid-mobile/pbm-api/android/pbm-targeting-params-android.html)


## California Consumer Privacy Act (CCPA)

{% capture ccpaNote %}

  In order for publishers to meet their user consent requirements under the CCPA, Prebid Mobile supports the IAB US Privacy signal as defined in the in-app section of the [IAB US Privacy signal for CCPA](https://iabtechlab.com/wp-content/uploads/2019/11/US-Privacy-USER-SIGNAL-API-SPEC-v1.0.pdf).  

  This is a reference for mobile app publishers using Prebid Mobile to surface notice, transparency and choice to end users located in California, United States, passing consent where necessary, to demand sources and their vendors.    

{% endcapture %}
{% include alerts/alert_note.html content=ccpaNote %}


### Consent Signal

Prebid mobile supports the [IAB US Privacy signal](https://iabtechlab.com/wp-content/uploads/2019/11/US-Privacy-USER-SIGNAL-API-SPEC-v1.0.pdf) implementation for CCPA. Publishers will be required perform the following actions:
- Collect consent from eligible CCPA users
- Translate consent signal into [IAB US Privacy String format](https://iabtechlab.com/wp-content/uploads/2019/11/U.S.-Privacy-String-v1.0-IAB-Tech-Lab.pdf)
- Store IAB US Privacy signal in NSUserDefaults for iOS or SharedPreferences for Android for persistent storage allowing access for vendors per IAB recommendations

The job of the Prebid SDK will:
- Read from NSUserDefaults (iOS) or SharedPreferences(Android) for US Privacy signal
	- Prebid SDK will look for the key "IABUSPrivacy_String", all other key names or spellings will be ignored
	- If the "IABUSPrivacy_String" key is present with a non-empty string value, the Prebid SDK will relay the privacy string to Prebid Server in the regs.ext.us_privacy extention
- Not perform or make any attempt to validate or ensure correctness of the US Privacy string
- Not strip any user data or signaling of the request regardless of consent


It is worth noting Prebid Server will be a passthrough as well and will not validate format or correctness of US Privacy signal nor strip any user data from the request either, even if the presence of an opt out.
