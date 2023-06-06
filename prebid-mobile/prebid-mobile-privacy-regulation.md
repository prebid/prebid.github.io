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
  This resource should not be construed as legal advice and Prebid.org makes no guarantees about compliance with any law or regulation. Please note that because every company and its collection, use, and storage of personal data is different, you should seek independent legal advice relating to obligations under European and /or US regulations, including the GDPR, the ePrivacy Directive and CCPA. Only a lawyer can provide you with legal advice specifically tailored to your situation. Nothing in this guide is intended to provide you with, or should be used as a substitute for, legal advice tailored to your business.
  {% endcapture %}

{% include /alerts/alert_important.html content=legalNotice %}

* TOC
{:toc}

## Prebid Mobile Guide to European Ad Inventory and Providing Notice, Transparency and Choice (GDPR)

{% capture gdprNote %}

In order for publishers to meet their transparency, notice and choice/consent requirements under the GDPR and the existing ePrivacy Directive, Prebid Mobile supports the [IAB Europe Transparency & Consent Framework](https://www.iab.com/topics/consumer-privacy/gdpr/) (the "Framework").  

This is a reference for mobile app publishers using Prebid Mobile to surface notice, transparency and choice to end users located in the EEA and signal approved vendors and, where necessary, pass consent information to demand sources and their vendors.  

{% endcapture %}

{% include alerts/alert_note.html content=gdprNote %}

### Framework APIs

Prebid Mobile provides API for app publishers to use with the Framework. This API allow you to:

-   Define whether the user is located in the European Economic Area (the "EEA") and if European privacy regulations should apply
-   Set the [IAB Europe](https://www.iabeurope.eu/) (IAB) consent string

This information will be persisted by Prebid Mobile and will be added to each ad call to the demand partners. 

Publishers/Consent Management Platforms (CMPs) are free to store these values in an `UserDefaults`/`SharedPreferences` interface (as defined by [IAB Tech Lab - CMP API v2](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/IAB%20Tech%20Lab%20-%20CMP%20API%20v2.md)) instead of passing them via the new APIs, and Prebid SDK will read the values as a fallback. The consent API's will check for TCF2.0 params -`IABTCF_gdprApplies` and `IABTCF_TCString`. 

Publishers are responsible for providing notice, transparency and choice and collecting consent from their users in accordance with [the Framework policies](https://www.iab.com/topics/consumer-privacy/gdpr/), either using their own CMP or working with a vendor.

-   [Register your own CMP](https://register.consensu.org/CMP)
-   [List of registered CMPs](https://iabeurope.eu/cmp-list/)

All vendor SDKs (including mediation SDKs) are responsible for looking up approved vendor and consent information on their own.

-   [iOS - Targeting Parameters](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
-   [Android - Targeting Parameters](/prebid-mobile/pbm-api/android/pbm-targeting-params-android.html)

### Sending Device Information

To ensure proper monetization and relevant targeting, the SDK should be enabled to send the device information. Setting the consentRequired and purposeConsents flag correctly will help ensure proper device information is sent. The table below provides information on:

- Determining whether the device details will be passed or not.
- Describing the actions taken for the different purposeConsents values in combination with consentRequired values.

{: .table .table-bordered .table-striped }
|                     | deviceAccessConsent= true    | deviceAccessConsent= false     | deviceAccessConsent= undefined        |
|---------------------|------------------------------|--------------------------------|---------------------------------------|
|consentRequired=false<br>(gdprApplies = false)|The SDK will read and pass IDFA/AAID info to server. |The SDK will **not** read and pass IDFA/AAID info to server. | The SDK will read and pass IDFA/AAID info to server.|
|consentRequired=true<br>(gdprApplies = true)|The SDK will read and pass IDFA/AAID info to server. |The SDK will **not** read and pass IDFA/AAID info to server. | The SDK will **not** read and pass IDFA/AAID info to server.|
|consentRequired=undefined<br>(gdprApplies = undefined)|The SDK will read and pass IDFA/AAID info to server. |The SDK will **not** read and pass IDFA/AAID info to server. | The SDK will read and pass IDFA/AAID info to server.|

{% capture codeNote %}
  Publishers set the value of `gdprApplies` in `Targeting.shared.subjectToGDPR` and `purposeConsent` in `Targeting.shared.purposeConsents`.

  {% endcapture %}

{% include /alerts/alert_important.html content=codeNote %}

### Code Samples

#### iOS

```
Targeting.shared.subjectToGDPR = false;

Targeting.shared.gdprConsentString = "BOMyQRvOMyQRvABABBAAABAAAAAAEA";

Targeting.shared.purposeConsents = "100000000000000000000000";

let deviceAccessConsent = Targeting.shared.getDeviceAccessConsent();
```

#### Android

```
TargetingParams.setSubjectToGDPR(context, true);

TargetingParams.setGDPRConsentString("BOMyQRvOMyQRvABABBAAABAAAAAAEA");
    
TargetingParams.setPurposeConsents("101010001");
```

## California Consumer Privacy Act (CCPA)

{% capture ccpaNote %}

In order for publishers to meet their notice and opt out obligations under the CCPA,
Prebid Mobile supports the IAB US Privacy signal as defined in the in-app section of the [IAB US Privacy signal for CCPA](https://iabtechlab.com/standards/ccpa/).  

This is a reference for mobile app publishers using Prebid Mobile to surface notice, transparency and choice to end users located in California, United States, passing notice and opt out signals where necessary, to demand sources and their vendors.    

{% endcapture %}
{% include alerts/alert_note.html content=ccpaNote %}


### Notice and Opt out signal

Prebid mobile supports the [IAB US Privacy signal](https://iabtechlab.com/standards/ccpa/) implementation for CCPA. Publishers will be required perform the following actions:

- Collect notice and opt out signals from eligible CCPA users
- Translate notice and opt-out signals into [IAB US Privacy String format](https://iabtechlab.com/standards/ccpa/)
- Store IAB US Privacy signal in `UserDefaults` for iOS or `SharedPreferences` for Android for persistent storage allowing access for vendors per IAB recommendations

The job of the Prebid SDK will:
- Read from `UserDefaults` (iOS) or `SharedPreferences` (Android) for US Privacy signal
    - Prebid SDK will look for the key `IABUSPrivacy_String`, all other key names or spellings will be ignored
    - If the `IABUSPrivacy_String` key is present with a non-empty string value, the Prebid SDK will relay the privacy string to Prebid Server in the `regs.ext.us_privacy` extention
- Not perform or make any attempt to validate or ensure correctness of the US Privacy string
- Not strip any user data or signaling of the request regardless of Notice and Opt out signal

It is worth noting Prebid Server will be a passthrough as well and will not validate format or correctness of US Privacy signal nor strip any user data from the request either, even if the presence of an opt out.



<script type="text/javascript" src="/assets/js/video/pb-code-highlight.js"></script>
