---
layout: page_v2
title: Prebid Quebec Privacy Support
description: Prebid Quebec Privacy Support
sidebarType: 0
---

# Prebid Quebec Privacy Support
{: .no_toc}

- TOC
{:toc}

{: .alert.alert-warning :}
This resource should not be construed as legal advice and Prebid.org makes no guarantees about compliance with any law or regulation. Please note that because every company and its collection, use, and storage of personal data is different, you should seek independent legal advice relating to obligations under Canadian, European and/or US regulations, including the GDPR, the ePrivacy Directive, CCPA, other state privacy laws, etc, and how you implement the tools outlined in this document. Only your lawyer can provide you with legal advice specifically tailored to your situation. Nothing in this guide is intended to provide you with, or should be used as a substitute for, legal advice tailored to your business.

## Overview

Starting September 23 2023, new privacy regulations will come into effect in Quebec, a province of Canada, governing about a quarter of Canada's population.

IAB Canada has offered a modified version of the Transparency and Consent Framework (TCF) as a solution to cover user consent preferences in Quebec. At the time of this writing (August 2023), guidance from regulators, TCF Canada, and major advertising entities in Canada is in flux, even though enforceability of the law is imminent. The Canadian vendor list does not have enough vendors for meaningful adoption of the framework by any publisher, as it does not include the primary publisher ad server nor any large DSP, nor have any of the top five CMPs [registered as CMPs with TCF Canada](https://iabcanada.com/tcf-canada/cmp-list/).

The full list of CMPs registered on August 11 2023 are: ATOMIOS, Consent Manager AB, Transfon Ltd, Plex GmbH, Ketch Kloud Inc. The [Canadian vendor list](https://vendor-list.consensu.org/v2/ca/vendor-list.json) has 27 vendors.

Given this context, Prebid has identified publisher concern that many will not be able to transact programmatically in Quebec beginning in September. This document is intended to provide guidance on conveying user notification and consent signals as gathered by the publisher to Prebid software independent of the GPP signals in Section 5 and the lack of a working consent string framework from IAB Canada.

References:

- [TCF Canada Infographic on Quebec Privacy Law](https://iabcanada.com/content/uploads/2022/04/IAB-Canada_Quebec-Privacy-Law-Inforgraphic.pdf)
- [IAB Canada TCF Canada policies](https://iabcanada.com/tcf-canada/for-publishers/)
- [IABTL's GPP Canada section spec](https://github.com/InteractiveAdvertisingBureau/Global-Privacy-Platform/blob/main/Sections/Canada/GPPExtension%3A%20IAB%20Canada%20TCF.md)

Prebid.org cannot advise publishers on how to conform to privacy laws that affect their business. Instead, publishers should be aware of what privacy-related features Prebid supports so that their legal, product, and engineering teams can define a privacy implementation.

## TCF Canada and GPP Support in Prebid.js

Prebid.js supports a [GPP module](/dev-docs/modules/consentManagementGpp.html), but it does not interpret the strings in Section 5 (Canada). It simply takes the GPP signal from the CMP and includes it in outgoing network requests if those vendors initiating network requests have added support for GPP in their modules. It isn't clear if TCF Purpose 2 (consent to 'basic ad serving') or a vendor list will be critical parts of a Quebec consent framework. Also, it isn't clear if publishers will be required to seek vendor-level consent as for TCF-EU.

Prebid.js is planning a TCF Canada module to react to the contents of the string, but it is not yet available, and may not be available on the date the law comes into effect. Instead, publishers may access their CMP or the consent preferences that their website visitors have expressed to them directly, and control Prebid.js activity. Below is an example of how the Prebid.js [Activity Control system](/dev-docs/activity-controls.html) could be used to implement an interim solution for ad serving in Quebec:

```javascript
function isQuebecPersonConsentDenied() {
### a __gpp getSection command might be useful here, but generally, the publisher can implement this however they choose
   if(someCondition) { return true } else { return false }});
}

pbjs.setConfig({
    allowActivities: {
          enrichUfpd: {
                 rules: [{
                       condition: isQuebecPersonConsentDenied,
                       allow: false
                 }]
          },
          enrichEids: {
                rules: [{
                       condition: isQuebecPersonConsentDenied,
                       allow: false
                }]
          },
          syncUser: {
                rules: [{
                       condition: isQuebecPersonConsentDenied,
                       allow: false
                }]
          },
          transmitEids: {
                rules: [{
                       condition: isQuebecPersonConsentDenied,
                       allow: false
                }]
          },
          transmitPreciseGeo: {
                rules: [{
                       condition: isQuebecPersonConsentDenied,
                       allow: false
                }]
          },
          transmitUfpd: {
                rules: [{
                       condition: isQuebecPersonConsentDenied,
                       allow: false
                }]
          }
          
    }
})
```

In addition, according to [Google Ad Manager documentation](https://support.google.com/admanager/answer/7678538) a publisher should call `googletag.pubads().setPrivacySettings({nonPersonalizedAds: true})` when consent for personalized advertising is not available.

## Quebec and Prebid Server

Like Prebid.js, there is a TCF Canada module planned for Prebid Server, but given the uncertainties
in implmentation, it may not be complete by the end of September.

One option for supporting Quebec in Prebid Server (including mobile apps and AMP pages) would be
to simply let if pass GPP strings containing Section 5 through to bidders, trusting that they
will interpret the string in alignment with Quebec law. Prebid cannot provide guidance on which
bidders are in such alignment.

An alternate solution would utilize the Prebid Server version of the [Activity Control system](/prebid-server/features/pbs-activitycontrols.html).

{: .alert.alert-info :}
Only the Java version of Prebid Server currently supports the Activity Control system.

Here's an example account configuration that utilizes the user's geographic region to determine
whether to allow or deny the named activities. Publishers will need to confirm the details with
their Prebid Server host company.

```javascript
{
  privacy: {
    allowactivities: {
      syncUser: {
        rules: [{
          geo: ["CAN.QC"]
        }],
        allow: false
      },
      transmitUfpd: {
        rules: [{
          geo: ["CAN.QC"]
        }],
        allow: false
      },
      transmitPreciseGeo: {
        rules: [{
          geo: ["CAN.QC"]
        }],
        allow: false
      }
    }
  }
}
```

## Related Topics

- Prebid.js: [Activity Controls](/dev-docs/activity-controls.html), [GPP module](/dev-docs/modules/consentManagementGpp.html), [GPP USNat module](/dev-docs/modules/gppControl_usnat.html)
- Prebid Server: [Activity Controls](/prebid-server/features/pbs-activitycontrols.html)
