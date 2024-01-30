---
layout: page_v2
title: Prebid MSPA Support
description: Prebid MSPA Support
sidebarType: 0
---

# Prebid Multi-State Privacy Agreement Support
{: .no_toc}

- TOC
{:toc}

{: .alert.alert-warning :}
This resource should not be construed as legal advice and Prebid.org makes no guarantees about compliance with any law or regulation. Please note that because every company and its collection, use, and storage of personal data is different, you should seek independent legal advice relating to obligations under European and/or US regulations, including the GDPR, the ePrivacy Directive, CCPA, other state privacy laws, etc, and how you implement the tools outlined in this document. Only your lawyer can provide you with legal advice specifically tailored to your situation. Nothing in this guide is intended to provide you with, or should be used as a substitute for, legal advice tailored to your business.

## Overview

Starting July 1st 2023, several US states started enforcing new privacy regulations.

The IAB released the "Multi-State Privacy Agreement" (MSPA) as its proposal for how the advertising ecosystem can support these and future US State regulations. References:

- [IAB's MSPA](https://www.iab.com/news/multi-state-privacy-agreement-mspa/)
- IAB Guidance on the [MSPA Decision Tree](https://www.iab.com/wp-content/uploads/2022/12/IAB_MSPA_Decision_Tree.pdf)
- IAB's [US National technical protocols](https://github.com/InteractiveAdvertisingBureau/Global-Privacy-Platform/tree/main/Sections)

### Glossary

1. **Global Privacy Platform (GPP)** - A technical IAB framework that defines a container format for communicating multiple privacy protocols. e.g. GPP can contain existing Transparency and Consent Framework (TCF) strings, various US privacy string formats, and other future implementations.
1. **GPP Section ID (SID)** - the GPP container may contain multiple encoded privacy protocol strings. Each protocol gets its own SID in the overall GPP container. e.g. TCF-EU is assigned SID 2.
1. **Multi-State Privacy Agreement (MSPA)** - the IAB's contractual framework for publishers to manage various US state privacy laws.
1. **MSPA Covered Transaction** - Whether a given ad auction falls legally under the MSPA's privacy requirements. For MSPA-covered 'transactions' (ad auctions), publishers must declare themselves in one of two modes: "Service Provider Mode" or "Opt-Out Mode".
1. **MSPA Service Provider Mode** - "Service Provider Mode is for First Parties who do not Sell or Share Personal Information, and do not Process Personal Information for Targeted Advertising". This means that personal information is never sent to downstream entities.
1. **MSPA Opt-Out Mode** - For First Parties that may engage in targeted advertising activities or disclose personal information for such purposes. This means that user consent is gathered before privacy-sensitive data is sent to downstream entities.
1. **US National Privacy Technical Specification (USNat)** -  the IAB's technical framework for encoding MSPA publisher policies and user consents. Stored in the GPP container as SID 7.
1. **US State Privacy Technical Specifications** - the IAB has defined technical frameworks for 5 states based on their interpretation of state privacy laws. These protocols are similar to the US National protocol and are stored in the GPP container as SIDs 8 through 12.
1. **Global Privacy Control (GPC)** - a browser-level control for end users. Some US states have referred to a global control so that users don't have to state their preferences on each website they visit. The USNat protocol strings also contain the GPC flag.
1. **US Privacy** - this is the IAB's original version of a US privacy protocol, meant to address CCPA only. It's active during a transition period until September 30, 2023.
1. **Prebid Activity Controls** - Prebid.js and Prebid Server have identified a set of behaviors for activities that may be in scope for privacy concerns such as transmitting user IDs. These activities may be allowed or suppressed with flexible conditions and exceptions as defined by the publisher.
    - [Prebid.js Activity Controls](/dev-docs/activity-controls.html) were released with PBJS 7.52
    - [Prebid Server Activity Controls](/prebid-server/features/pbs-activitycontrols.html) were released with PBS-Java 1.118

### Assumptions

Prebid.org cannot advise publishers on how to conform to privacy laws that affect their business. Instead, publishers should be aware of what privacy-related features Prebid supports so that their legal, product, and engineering teams can define a privacy implementation.

Prebid's assumptions about the MSPA and the US National Privacy specification:

1. Most Publishers will initially declare ad units in their CMP as "Not covered by MSPA." (MspaCoveredTransaction=2) This is because many major SSPs, DSPs, and Ad Servers have not signed the MSPA and some of these parties are dropping MSPA-covered transactions.
    - At some point in the future when more major players have signed the MSPA, the Prebid community and legal counsel will re-evaluate the state of the industry.
1. For requests that are in-scope for SIDs 7 through 12 that are not "covered" by MSPA, Prebid treats them as being in "Opt-Out Mode". This implies that CMPs have prompted users for consent and encoded the results in the relevant section of the GPP container.
1. Prebid never changes the GPP string. This means that all downstream vendors will see whatever the CMP set.
1. Prebid has implemented a default way to interpret the US National string (SID 7) in the context of each Prebid Activity.
1. US state privacy rules do not mandate the cancellation of contextual advertising, but rather are focused on protecting user privacy. Therefore, Prebid's MSPA module may anonymize different aspects of a header bidding auction, but will never outright cancel an auction.
1. There are differences in the US state-level protocols and the US National protocol as defined by the IAB. (e.g. child consent for targeted advertising is somewhat different across SIDs 7 through 12.)
1. Rather than implementing several very similar modules and forcing publishers to include separate modules for each US state, Prebid handles state differences through a normalization process. The differences for each state are mapped onto the US National (SID 7) string, and that string is interpreted for which activities are allowed or suppressed. As with the rest of Prebid’s approach, this is a default intended to ease publishers’ ability to comply with the state laws, but publishers should make their own determinations about state law obligations and consult legal counsel to ensure that they feel comfortable that this approach allows them to meet their legal obligations.
1. Publishers that do not agree with Prebid's default behavior may override the behavior. This includes the interpretation of the USNat string as well as the normalization of state protocols.
1. The Global Privacy Control (GPC) flag is interpreted as a strong user signal that ad requests should be anonymized.
1. There's no need to support a data-deletion activity for MSPA.
1. Prebid doesn't need to explicitly support mapping US National Privacy SID 6 (legacy US Privacy) for anonymization activities. This is covered by a feature on Prebid Server where SID 6 is pulled out into regs.us_privacy and is covered by documentation in Prebid.js.

## USNat Support in Prebid Products

### Prebid.js

Here's a summary of the privacy features in Prebid.js that publishers may use to align with the guidance of their legal counsel:

{: .table .table-bordered .table-striped }
| Prebid.js Version | USNat-Related Features | Notes |
| ----------------- | ---------------------- | ----- |
| before 7.30 | None | If you operate in the US, you should consider upgrading. |
| 7.30-7.51 | **GPP module** | The [GPP module](/dev-docs/modules/consentManagementGpp.html) reads the GPP string from a compliant CMP and passes to compliant bid adapters. Not many bid adapters supported GPP in earlier versions. |
| 7.52-8.1 | GPP module <br/> **Activity&nbsp;Controls** | [Activity Controls](/dev-docs/activity-controls.html) provide the ability for publishers to allow or restrict certain privacy-sensitive activities for particular bidders and modules. See examples in that document for supporting CCPA directly.
| 8.2-8.x | GPP module<br/>Activity Controls<br/>**USNat module** | The [USNat module](/dev-docs/modules/gppControl_usnat.html) processes SID 7. |
| After 8.x | GPP module<br/>Activity Controls<br/>USNat module<br/>**US&nbsp;State&nbsp;module** | The US State module processes SIDs 8 through 12 after normalizing protocol differences. |
| After 8.10 | **GPP Module**  | The [GPP module](/dev-docs/modules/consentManagementGpp.html) now understands GPP 1.1 which makes it incompatible with GPP 1.0. Publishers **<u>MUST</u>** upgrade for continued GPP support. |

### Prebid Server

Here's a summary of the privacy features in Prebid Server that publishers may use to align with the guidance of their legal counsel:

{: .table .table-bordered .table-striped }
| Prebid Server Version | USNat-Related Features | Notes |
| --------------------- | ---------------------- | ----- |
| PBS-Go before 0.236<br/>PBS-Java before 1.110 | None | If you operate in the US, you should consider upgrading. |
| PBS-Go 0.236<br/>PBS-Java 1.110 | **GPP passthrough** | PBS reads the GPP string from the ORTB request and passes to compliant bid adapters. Not many bid adapters supported GPP in earlier versions. |
| PBS&#8209;Go&nbsp;0.248&nbsp;and&nbsp;later<br/>PBS&#8209;Java&nbsp;1.113&nbsp;and&nbsp;later | GPP passthrough<br/>**GPP US Privacy** | PBS will read SID 6 out of the GPP string and process it as if regs.us_privacy were present on the request. |
| PBS-Go TBD<br/>PBS-Java 1.118 | GPP passthrough<br/>GPP US Privacy<br/>**Activity Controls** | [Activity Controls](/prebid-server/features/pbs-activitycontrols.html) grant the ability for publishers to allow or restrict certain privacy-sensitive activities for particular bidders and modules. |
| PBS-Go TBD<br/>PBS-Java 1.122 | GPP passthrough<br/>GPP US Privacy<br/>**Enhanced Activity Controls** | Activity controls support additional conditions for defining USNat-related rules: gppSid, geo, and gpc. |
| PBS-Go TBD<br/>PBS-Java 1.126 | GPP passthrough<br/>GPP US Privacy<br/>Enhanced Activity Controls<br/>**USGen Module** | The [USGen module](/prebid-server/features/pbs-usgen.html) processes SIDs 7 through 12 after normalizing protocol differences. |
| TBD | GPP passthrough<br/>GPP US Privacy<br/>Enhanced Activity Controls<br/>USNat Module<br/>**US&nbsp;Custom&nbsp;Logic&nbsp;module** | Allows publishers to provide alternate interpretations of the USNat string as it applies to Activity Controls. |

### Prebid SDK

SDK v2.0.8 (both iOS and Android) supports reading mobile app GPP data and passing it to Prebid Server.

## Interpreting USNat Strings

This section details the default for how Prebid code interprets GPP SIDs 7 through 12. It applies to both Prebid.js and Prebid Server.

### Requirements

When normalizing state-specific strings to the US National string, Prebid adds an additional "NULL" value which means that value was not present in the original string.

To make sense of the specific values below, please refer to the [IAB's USNat technical specifications](https://github.com/InteractiveAdvertisingBureau/Global-Privacy-Platform/tree/main/Sections).

1. The US National privacy module should be able to translate state-level differences into the US National (SID 7) sense of the flags using this mapping:
    1. KnownChild normalizations follow these rules:
        1. SID 7 has two 'KnownChild' values: ages 13-16 and under 13. The goal is to map SIDs 8-12 behavior to SID 7's structure.
        1. Prebid does not distinguish between "selling", "sharing", or "processing" data.
        1. If the state-level KnownChild values are all 0 (N/A), then the normalized output values are also 0. The assumption is that a KnownChild value of 0 means the user is not a child as defined by the various laws.
        1. If the state-specific values do not distinguish between ages 13-16 and under 13, Prebid will set the normalized values to be the same and will never report consent because we will not recognize consent from under 13. We've mapped information in the state-specific protocols in a conservative way.
    1. Normalization for California (CA) (SID 8)
        1. CA sensitive data 1 maps to US national sensitive data 9
        1. CA sensitive data 2 maps to US national sensitive data 10
        1. CA sensitive data 3 maps to US national sensitive data 8
        1. CA sensitive data 4 maps to US national sensitive data 1 and 2
        1. CA sensitive data 5 maps to US national sensitive data 12
        1. CA sensitive data 6 and 7 maps straight through to US national sensitive data 6 and 7
        1. CA sensitive data 8 maps to US national sensitive data 3
        1. CA sensitive data 9 maps to US national sensitive data 4
        1. Set these fields to NULL: SharingNotice, TargetedAdvertisingOptOutNotice, TargetedAdvertisingOptOut, SensitiveDataProcessingOptOutNotice, SensitiveDataProcessing[5 and 11]
        1. KnownChild - SID 8 does not distinguish between consent for ages 13-16 and under 13, so Prebid will never normalize a positive KnownChild consent.
            1. If CA string KnownChildSensitiveDataConsents[1]=0 and state string KnownChildSensitiveDataConsents[2]=0, then no change – these can be treated as the normalized KnownChildSensitiveDataConsents[1]=KnownChildSensitiveDataConsents[2]=0 (i.e. not a 'known child')
            1. Otherwise, the SID 8 protocol does not allow Prebid to know if the user is aged 13-16 or under 13, so simply set KnownChildSensitiveDataConsents[1] or [2] both to 1 (no consent)
        1. All other fields pass through.
    1. Normalization for Virginia (SID 9)
        1. Set these fields to NULL: SharingOptOutNotice, SharingOptOut, SensitiveDataLimitUseNotice, SensitiveDataProcessingOptOutNotice, SensitiveDataProcessing[9-12], PersonalDataConsents, GPC.
        1. KnownChild:  - SID 9 does not distinguish between consent for ages 13-16 and under 13, and the VA state laws define a child as being under 13, so Prebid will never normalize a positive KnownChild consent.
            1. If the SID 9 KnownChildSensitiveDataConsents value is 1 or 2, normalize to SID 7 KnownChildSensitiveDataConsents[1 and 2]=1 (no consent)
            1. If the SID 9 KnownChildSensitiveDataConsents value is 0, assume the user is not a child and normalize to SID 7 KnownChildSensitiveDataConsents[1 and 2]=0 (N/A)
        1. All other fields pass through.
    1. Normalization for Colorado (SID 10)
        1. Set these fields to NULL: SharingOptOutNotice, SharingOptOut, SensitiveDataLimitUseNotice, SensitiveDataProcessingOptOutNotice, SensitiveDataProcessing[8-12], PersonalDataConsents
        1. KnownChild - SID 10 does not distinguish between consent for ages 13-16 and under 13, so Prebid will never normalize a positive KnownChild consent.

        1. If the SID 10 KnownChildSensitiveDataConsents value is 1 or 2, normalize to SID 7 KnownChildSensitiveDataConsents[1 and 2]=1 (no consent)
        1. If the SID 10 KnownChildSensitiveDataConsents value is 0, assume the user is not a child and normalize to SID 7 KnownChildSensitiveDataConsents[1 and 2]=0 (N/A)
        1. All other fields pass through.
    1. Normalization for Utah (UT) (SID 11)
        1. UT sensitive data 1,2 maps straight through to US National 1,2
        1. UT sensitive data 3 maps to US National 4
        1. UT sensitive data 4 maps to US National 5
        1. UT sensitive data 5 maps to US National 3
        1. UT sensitive data 6,7,8 maps straight through to US National 6,7,8
        1. Set these fields to NULL: SharingOptOutNotice, SharingOptOut, SensitiveDataLimitUseNotice, SensitiveDataProcessing[9-12], PersonalDataConsents, GPC
        1. KnownChild - SID 11 does not distinguish between consent for ages 13-16 and under 13, so Prebid will never normalize a positive KnownChild consent.
            1. If the SID11 KnownChildSensitiveDataConsents value is 1 or 2, normalize to SID 7 KnownChildSensitiveDataConsents[1 and 2]=1 (no consent)
            1. If the SID11 KnownChildSensitiveDataConsents value is 0, assume the user is not a child and normalize to SID 7 KnownChildSensitiveDataConsents[1 and 2]=0 (N/A)
        1. All other fields pass through.
    1. Normalization for Connecticut (SID 12)
        1. Set these fields to NULL: SharingOptOutNotice, SharingOptOut, SensitiveDataLimitUseNotice, SensitiveDataProcessingOptOutNotice, SensitiveDataProcessing[9-12], PersonalDataConsents
        1. KnownChild - SID 12 does distinguish ages aligned with SID 7
            1. If SID 12 string KnownChildSensitiveDataConsents[1, 2, and 3] are all 0 then assume the user is not a child and set the normalized SID 7 KnownChildSensitiveDataConsents[1 and 2]=0 (N/A)
            1. SID 12 age ranges align with SID 7, so let ages 13-16 state their consent. If SID 12 string KnownChildSensitiveDataConsents[2]=2 and SID 12 string KnownChildSensitiveDataConsents[3]=2, then set the normalized KnownChildSensitiveDataConsents[1]=2 (Ages 13-16 consented) and the normalized KnownChildSensitiveDataConsents[2]=1 (under 13 not consented)
            1. Otherwise, set the normalized SID 7 KnownChildSensitiveDataConsents[1 and 2] to 1 (no consent)
        1. All other fields pass through.
    1. If the CMP provides a non-zero value for any of the following sensitive data categories, the module should suppress the activity. In other words, if there's any hint that data from these categories is associated with advertising, Prebid should anonymize first-party data.
        1. Genetic (6)
        1. Biometric (7)
        1. Personal Info (9)
        1. Login/Credit Card (10)
        1. Email content (12)
    1. The publisher should be able to override the default activity restriction logic with fine-grained control over all of the flags, including the ability to refine the conditions separately for ServiceProvider and OptOut modes, and for the MspaCoveredTransaction flag.
        1. The overrides should support the ability for the platform to understand whether it should be looking at the native SID state flags or the 'normalized' flags mapped from the process above.
    1. It should be possible for a publisher to override the USNat logic differently for different states.
    1. Prebid's default restrictions should be tight. Restrict the potential for syncing and/or ad targeting when
        1. in ServiceProvider mode
        1. the GPC flag is set
        1. in OptOut mode and any of the following are true
            1. notice was not provided
            1. opt-out was chosen
            1. consent for sensitive or 'known child' was not provided
            1. invalid data was provided by the CMP

### USNat Activity Restrictions

This table documents the default blocks of boolean logic that indicate whether a given privacy activity is allowed or suppressed.

{: .table .table-bordered .table-striped }
| Activity | USNat Disallow Logic | Notes |
| -------- | ---------------------- | ----- |
| deviceAccess | n/a | Default to 'allow'. Publisher Activity Control config may cause it to 'restrict'. |
| fetchBid | n/a | Header bidding auctions are always allowed, but aspects of them may be anonymized. |
| reportAnalytics | n/a | Analytics always allowed, but may be anonymized. |
| syncUser | MspaServiceProviderMode=1 OR<br/>GPC=1 OR<br/>SaleOptOut=1 OR<br/>SaleOptOutNotice=2 OR<br/>(SaleOptOutNotice=0 AND SaleOptOut=2) OR<br/>SharingNotice=2 OR<br/>SharingOptOutNotice=2 OR<br/>(SharingOptOutNotice=0 AND SharingOptOut=2) OR<br/>(SharingNotice=0 AND SharingOptOut=2) OR <br/>SharingOptOut=1 OR<br/>TargetedAdvertisingOptOutNotice=2 OR<br/>TargetedAdvertisingOptOut=1 OR<br/>(TargetedAdvertisingOptOutNotice=0 AND TargetedAdvertisingOptOut=2) OR<br/>KnownChildSensitiveDataConsents[2]==1 OR<br/>KnownChildSensitiveDataConsents[2]==2 OR<br/>KnownChildSensitiveDataConsents[1]=1 OR<br/>PersonalDataConsents=2 | Suppress usersyncs when activity is not allowed:<br/>- Service Provider Mode<br/>- GPC flag<br/>- Lack of notice<br/>- Any opt-out<br/>- Allow kids 13-16 to consent, but always anonymize under age 13.<br/>- Notice was considered unnecessary yet permission to engage in targeted advertising is somehow considered valid.<br/>- Do not trust a CMP that claims to have 'personal data consent' for something that's logically impossible. |
| enrichEids | (same as syncUser) | Suppress the addition of EIDs when activity is not allowed. |
| enrichUfpd | (same as syncUser) | Suppress the addition of User First Party Data when activity is not allowed. |
| transmitEids | (same as syncUser) | Suppress the transmission of user.eids when activity is not allowed. |
| transmitUfpd | MspaServiceProviderMode=1 OR<br/>GPC=1 OR<br/>SaleOptOut=1 OR<br/>SaleOptOutNotice=2 OR<br/>SharingNotice=2 OR<br/>(SaleOptOutNotice=0 AND SaleOptOut=2) OR<br/>SharingOptOutNotice=2 OR<br/>SharingOptOut=1 OR<br/>(SharingOptOutNotice=0 AND SharingOptOut=2) OR<br/> (SharingNotice=0 AND SharingOptOut=2) OR <br/> TargetedAdvertisingOptOutNotice=2 OR<br/>TargetedAdvertisingOptOut=1 OR<br/>(TargetedAdvertisingOptOutNotice=0 AND TargetedAdvertisingOptOut=2) OR<br/>SensitiveDataProcessingOptOutNotice=2 OR<br/>SensitiveDataLimitUseNotice=2 OR<br/>((SensitiveDataProcessingOptOutNotice=0 OR SensitiveDataLimitUseNotice=0) AND SensitiveDataProcessing[1-7,9-12]=2)<br/>SensitiveDataProcessing[1-5,11]=1 OR<br/>SensitiveDataProcessing[6,7,9,10,12]=1 OR<br/>SensitiveDataProcessing[6,7,9,10,12]=2 OR<br/>KnownChildSensitiveDataConsents[2]==1 OR<br/>KnownChildSensitiveDataConsents[2]==2 OR<br/>KnownChildSensitiveDataConsents[1]=1 OR<br/>PersonalDataConsents=2 | Suppress the transmission or user.ext.data.*, user.data.*, and device IDs when the activity is not allowed.<br/><br/>The difference in this logic compared to syncUser is that it includes 'sensitive data' flags. See the requirements above and the commentary below. |
| transmitPreciseGeo | MspaServiceProviderMode=1 OR<br/>GPC=1 OR<br/>SensitiveDataProcessingOptOutNotice=2 OR<br/>SensitiveDataLimitUseNotice=2 OR<br/>((SensitiveDataProcessingOptOutNotice=0 OR SensitiveDataLimitUseNotice=0) AND SensitiveDataProcessing[8]=2)<br/>SensitiveDataProcessing[8]=1 OR<br/>KnownChildSensitiveDataConsents[2]==1 OR<br/>KnownChildSensitiveDataConsents[2]==2 OR<br/>KnownChildSensitiveDataConsents[1]=1 OR<br/>PersonalDataConsents=2 | Round IP address and lat/long in both device.geo and user.geo when the activity is not allowed.<br/><br/>The difference in this logic is that it includes "sensitive data 8" (geo) and does not include the UFPD- and ID-related fields. |
| transmitTid | n/a | Sending transaction IDs is not an aspect of USNat. |

NOTE -- Here's what the numbers in the logic above indicate in the [IAB GPP USNat specification](https://github.com/InteractiveAdvertisingBureau/Global-Privacy-Platform/blob/main/Sections/US-National/IAB%20Privacy%E2%80%99s%20National%20Privacy%20Technical%20Specification.md):

MspaServiceProviderMode:

- 0 - Not Applicable
- 1 - Yes
- 2 - No

SaleOptOut, SharingOptOut, TargetedAdvertisingOptOut:

- 0 - Not Applicable
- 1 - Opted-Out
- 2 - Did not Opt-Out

SaleOptOutNotice, SharingNotice, TargetedAdvertisingOptOutNotice, SensitiveDataProcessingOptOutNotice, SensitiveDataLimitUseNotice:

- 0 - Not Applicable
- 1 - Notice was provided
- 2 - Notice was not provided

KnownChildSensitiveDataConsents, PersonalDataConsents, SensitiveDataProcessing:

- 1 - No Consent
- 2 - Consent

### Commentary

Prebid arrived at this logic through community discussions and in conjunction with legal counsel. First, we established the requirements and then translated them into boolean logic. Here's a commentary on the default logic for the `transmitUfpd` activity:

```javascript
// In ServiceProvider mode, a publisher has declared they don't use personal data,
// so Prebid can anonymize all aspects of the request
MspaServiceProviderMode=1 OR

// The Global Privacy Control flag means to anonymize everything
GPC=1 OR

// Notice was not given to the user about opting out of the sale of their data
SaleOptOutNotice=2 OR

// The user opted out of the sale of their data
SaleOptOut=1 OR

// Notice was not given to the user about the sharing of their data
SharingNotice=2 OR

// The CMP claims that notice was not needed, but at the same time claims consent was given
(SaleOptOutNotice=0 AND SaleOptOut=2) OR

// Notice was not given to the user about opting out of the sharing of their data
SharingOptOutNotice=2 OR

// The user opted out of the sharing of their data
SharingOptOut=1 OR

// The CMP claims that notice was not needed, but at the same time claims consent was given
(SharingOptOutNotice=0 AND SharingOptOut=2) OR

// The CMP claims that notice was not needed, but at the same time claims consent was given
(SharingNotice=0 AND SharingOptOut=2) OR

// Notice was not given to the user about opting out of ad targeting
TargetedAdvertisingOptOutNotice=2 OR

// The user opted out of ad targeting
TargetedAdvertisingOptOut=1 OR

// The CMP claims that notice was not needed, but at the same time claims consent was given
(TargetedAdvertisingOptOutNotice=0 AND TargetedAdvertisingOptOut=2) OR

// Notice was not given to the user about opting out of processing sensitive data
SensitiveDataProcessingOptOutNotice=2 OR

// Notice was not given to the user about limiting the use of their sensitive data
SensitiveDataLimitUseNotice=2 OR

// The CMP claims that notice was not needed, but at the same time claims consent was given
// Note that SensitiveDataProcessing[8] is the geographic location and covered in the `transmitPreciseGeo` activity
((SensitiveDataProcessingOptOutNotice=0 OR SensitiveDataLimitUseNotice=0) AND SensitiveDataProcessing[1-7,9-12]=2)

// The user has not consented to share data of categories 1-5 and 11
SensitiveDataProcessing[1-5,11]=1 OR

// Data of the following categories should never be present in ad calls.
// So whether consented or not consented, anonymize UFPD if the CMP says they're present
SensitiveDataProcessing[6,7,9,10,12]=1 OR
SensitiveDataProcessing[6,7,9,10,12]=2 OR

// If a child 13-16 has not granted consent
KnownChildSensitiveDataConsents[1]=1 OR

// Do not accept consent from a child younger than 13
KnownChildSensitiveDataConsents[2]==1 OR
KnownChildSensitiveDataConsents[2]==2 OR

// The CMP claims to have consent for an 'unrelated' activity.
// Prebid views this as a logical impossibility and an invalid CMP response
PersonalDataConsents=2
```

{: .alert.alert-info :}
If a publisher's legal team disagrees with any of these interpretations, both Prebid.js and Prebid Server
support overriding this default logic.

The `transmitPreciseGeo` activity has a couple of clauses not already mentioned:

```javascript
// Consent was not given for the use of "precise geographic" information
SensitiveDataProcessing[8]=1 OR

// The CMP claims that notice was not needed, but at the same time claims consent was given
((SensitiveDataProcessingOptOutNotice=0 OR SensitiveDataLimitUseNotice=0) AND SensitiveDataProcessing[8]=2)
```

## Related Topics

- Prebid.js: [Activity Controls](/dev-docs/activity-controls.html), [GPP module](/dev-docs/modules/consentManagementGpp.html), [GPP USNat module](/dev-docs/modules/gppControl_usnat.html)
- Prebid Server: [Activity Controls](/prebid-server/features/pbs-activitycontrols.html)
