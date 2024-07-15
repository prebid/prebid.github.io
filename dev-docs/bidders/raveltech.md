---
layout: bidder
title: RavelTech
description: Prebid RavelTech Bidder Adaptor
biddercode: raveltech
media_types: banner, video, native
tcfeu_supported: true
dsa_supported: true
prebid_member: true
userIds: all (with commercial activation)
schain_supported: true
coppa_supported: true
usp_supported: true
gpp_supported: true
floors_supported: true
fpd_supported: false
pbjs: true
pbjs_version_notes: please avoid using v7.15 and v7.16
pbs: true
gvl_id: 32
sidebarType: 1
---

# RavelTech Bid Adapter

Ravel Technologies developed ZKAD (Zero-Knowledge ADvertising), a protocol anonymizing RTB data & PII during the RTB bidding process and during data processing.
ZKAD is using a scalable proprietary Homomorphic Encryption scheme (Ravel Homormorphic Encryption, RHE), a form of encryption that allows to perform computations at scale on encrypted data without having to first decrypt it.
ZKAD allows publishers to protect users’ privacy and publishers’ data while allowing advanced targeted advertising and advanced regulatory compliance.

Ravel Bidder is a “Privacy Bus” allowing to anonymize bid requests before forwarding them to SSP and DSP preventing any personal data to be transferred to SSP and DSP. PII IDs are removed or/and anonymized into RIDs (Ravelized IDs). Furthermore, User-Agent is truncated, and location is provided with a significant Radius. IP addresses are not stored by the Privacy Bus and are not provided in the bid requests.

The RavelTech Prebid Adapter first version supports only Xandr/Appnexus SSP and should be configured with your current Xandr/Appnexus existing params.
For more information about the Xandr/AppNexus params can be found at [https://github.com/prebid/prebid.github.io/blob/master/dev-docs/bidders/appnexus.md]

Please contact [support@raveltech.io] to activate your adapter after installation or for more information.