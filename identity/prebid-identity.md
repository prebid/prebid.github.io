---
layout: page_v2
title: Prebid User Identity
description: What is Prebid User Identity
sidebarType: 9
---

# Prebid User Identity Overview

Prebid's aim is to enable the protection of user privacy while still supporting publisher's ability to make revenue,
keeping the Open Web healthy.

To do this, Prebid offers a number of identity-related products that encourage awareness of privacy regulations such as GDPR, CCPA, and COPPA. The most important projects are:

- [Prebid.js User Identity Module](/dev-docs/modules/userId.html) - supporting more than 20 different flavors of global IDs with different features, publishers can work with.
- [SharedID](/identity/sharedId.html) - Prebid's native hosted ID offering is simple, free, robust, and privacy-minded.
- **Coming soon:** [UID2](https://prebid.org/blog/prebid-org-to-serve-as-operator-of-unified-id-2-0/)

## Prebid.js and Identity

Publishers have several ways to include user identity as part of
the header bidding auction:

1. Install one or more [User ID modules](/dev-docs/modules/userId.html) - these modules obtain
the user's ID from the service and make it available to participating bidders. Publishers
can place [permissons](/dev-docs/modules/userId.html#permissions) on which bidders receive which IDs.
2. Install the [ID Import Module](/dev-docs/modules/idLibrary.html) - this can be
used to generate a map of identities present on the page.
3. Pass [First Party Data](/features/firstPartyData.html) to bidders such as interests to bidders for more relevant advertising.
4. [User Syncing](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Configure-User-Syncing) allows bid adapters to establish IDs. Publishers have control over which bidders may sync, which syncing mechanisms are allowed, and when the syncing occurs. Syncing is subject to privacy controls such as GDPR, CCPA, and COPPA.

## Prebid Server and Identity

Prebid Server has user sync functionality allowing server-side bidders to establish
IDs given appropriate permission from the user for setting cookies.

Prebid Server can receive extended ID arrays (eids) from Prebid.js and provide them to
participating server-side bid adapters. It also supports permissioning to determine
which eids can be sent to which bidders.

User IDs are not sent to bid adapters in privacy scenarios such as COPPA and 
GDPR requests lacking appropriate consent. For more details see the [Prebid Server Privacy](/prebid-server/features/pbs-privacy.html) page.

## Prebid SDK and Identity

In application environments, performance-based advertisers rely on a device’s IDFA to target,
frequency cap and determine attribution, very similar to how cookies are used in desktop
environments, however IDFAs are persistent to the device. Prebid SDK will read the IDFA from
the device when available. Additionally, Prebid SDK supports third party identity IDs.

Prebid Server will strip the IDFA and / or third party identity IDs when enforcing regulations such as GDPR and CCPA.

## AMP, Prebid, and Identity

Prebid Server supports a user [cookie-sync](/prebid-server/developers/pbs-cookie-sync.html) functionality, including integration with
a consent management platform. This allows server-side bidders to establish IDs given
the appropriate cookie-setting permissions from the user.

## Further Reading

- [PBJS User ID module](/dev-docs/modules/userId.html)
- [SharedID](/identity/sharedId.html)
- [Prebid Server Privacy](/prebid-server/features/pbs-privacy.html)
