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

Prebid Mobile provides three APIs for app publishers to use with the Framework. These APIs allow you to:

-   Define whether the user is located in the European Economic Area (the "EEA") and if European privacy regulations should apply
-   Set the [IAB Europe](https://www.iabeurope.eu/) (IAB) consent string

This information will be persisted by Prebid Mobile and will be added to each ad call to the demand partners. Publishers/Consent Management Platforms (CMPs) are free to store these values in an `NSUserDefaults/SharedPreferences` interface (as defined by [Mobile In-App CMP API v1.0: Transparency & Consent Framework](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/Mobile%20In-App%20Consent%20APIs%20v1.0%20Final.md)) instead of passing them via the new APIs, and Prebid Mobile will read the values as a fallback. The consent API's will check for TCF2.0 params (`IABTCF_gdprApplies` and `IABTCF_TCString`). If the parameters are not available they will fall back to TCF1.1 parameters (`IABConsent_SubjectToGDPR` and `IABConsent_ConsentString`)

Publishers are responsible for providing notice, transparency and choice and collecting consent from their users in accordance with [the Framework policies](https://www.iab.com/topics/consumer-privacy/gdpr/), either using their own CMP or working with a vendor.

-   [Register your own CMP](https://register.consensu.org/CMP)
-   [List of registered CMPs](https://iabeurope.eu/cmp-list/)

All vendor SDKs (including mediation SDKs) are responsible for looking up approved vendor and consent information on their own.

-   [iOS - Targeting Parameters](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
-   [Android - Targeting Parameters](/prebid-mobile/pbm-api/android/pbm-targeting-params-android.html)

## Sending Device Information

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

## Code Samples

### iOS

<div>
<pre>

  /** * Set the consentRequired value in the SDK
  *
  * @param true if subject to GDPR regulations, false otherwise
  */
  Targeting.shared.subjectToGDPR = false;

  /**
  * Set the consent string in the SDK
  *
  * @param A valid Base64 encode consent string as per https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework
  */
  Targeting.shared.gdprConsentString = "BOMyQRvOMyQRvABABBAAABAAAAAAEA";

  /**
  * Set the purpose consents in the SDK
  *
  * @param A valid Binary String: The '0' or '1' at position n – where n's indexing begins at 0 – indicates the consent status for purpose ID n+1; false and true respectively. eg. '1' at index 0 is consent true for purpose ID 1
  */
  Targeting.shared.purposeConsents = "100000000000000000000000";


  /**
  * Get the device consent extracted from the purpose1 consent provided
  *
  */
  let deviceAccessConsent = Targeting.shared.getDeviceAccessConsent();

</pre>
</div>

### Android

<div>
<pre>

    /** * Set the consentRequired value in the SDK
    *
    * @param true if subject to GDPR regulations, false otherwise
    */
    TargetingParams.setSubjectToGDPR(context, true);


    /**
    * Set the consent string in the SDK
    *
    * @param A valid Base64 encode consent string as per
    * https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework
    */
    TargetingParams.setGDPRConsentString("BOMyQRvOMyQRvABABBAAABAAAAAAEA");

    /**
    * Set the purpose consents in the SDK
    *
    * @param A valid Binary String: The '0' or '1' at position n – where n's indexing begins at 0 – indicates the consent status for purpose ID n+1; false and true respectively. eg. '1' at index 0 is consent true for purpose ID 1
    */
    TargetingParams.setPurposeConsents("101010001");

</pre>
</div>

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
- Store IAB US Privacy signal in NSUserDefaults for iOS or SharedPreferences for Android for persistent storage allowing access for vendors per IAB recommendations

The job of the Prebid SDK will:
- Read from NSUserDefaults (iOS) or SharedPreferences(Android) for US Privacy signal
	- Prebid SDK will look for the key "IABUSPrivacy_String", all other key names or spellings will be ignored
	- If the "IABUSPrivacy_String" key is present with a non-empty string value, the Prebid SDK will relay the privacy string to Prebid Server in the regs.ext.us_privacy extention
- Not perform or make any attempt to validate or ensure correctness of the US Privacy string
- Not strip any user data or signaling of the request regardless of Notice and Opt out signal

It is worth noting Prebid Server will be a passthrough as well and will not validate format or correctness of US Privacy signal nor strip any user data from the request either, even if the presence of an opt out.



<script type="text/javascript" src="/assets/js/video/pb-code-highlight.js"></script>
