---
layout: bidder
title: TrustX 2.0
description: Prebid TrustX 2.0 Bidder Adapter
pbjs: true
pbs: true
biddercode: trustx2
media_types: banner, video
multiformat_supported: will-bid-on-any
tcfeu_supported: true
usp_supported: true
gpp_supported: true
schain_supported: true
floors_supported: true
userIds: all
tcf2_supported: true
coppa_supported: true
fpd_supported: true
sidebarType: 1

---

### Integration

Approval from the TRUSTX team is required for the TrustX 2.0 Header Bidding adapter.
For additional information, please reach out to <prebid@trustx.org>.

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope    | Description        | Example     | Type      |
|------|----------|--------------------|-------------|-----------|
| `publisher_id` | required | Publisher ID | `'0000'` | `string`  |
| `placement_id` | required | Placement ID | `'11111'` | `string`  |
| `bidfloor` | optional | Bid Floor | `2.3` | `float` |
| `bidfloorcur` | optional | Bid Floor Currency | `'USD'` | `string` |


<a name="trustx2-bidder-config"></a>

### Bidder Config

You can allow writing in localStorage using `pbjs.setBidderConfig` for the bidder `trustx2`

```javascript
pbjs.setBidderConfig({
    bidders: ["trustx2"],
    config: {
        localStorageWriteAllowed: true
    }
})
```

This allows the TrustX 2.0 Bid Adapter to write userId in first party localStorage, which facilitates user identification and ensures data privacy management.

<a name="trustx2-first-party"></a>

### First Party Data

Publishers should use the `ortb2` method of setting [First Party Data](https://docs.prebid.org/features/firstPartyData.html).

Global site or user data using `setConfig()`, or Bidder-specific using `setBidderConfig()` supports the following fields:

- `ortb2.user.data[]`: Standard IAB segment taxonomy user data
- `ortb2.user.ext.device`: Non-standard arbitrary user device data
- `ortb2.user.ext.eids`: External identifiers for the user
- `ortb2.site.keywords`: Standard IAB OpenRTB 2.5 site.keywords field
- `ortb2.site.cat[]`: Standard IAB OpenRTB 2.5 site.cat field
- `ortb2.site.pagecat[]`: Standard IAB OpenRTB 2.5 site.pagecat field
- `ortb2.site.content.genre`: Standard IAB OpenRTB 2.5 site.content.genre field
- `ortb2.site.content.data`: Content data segments

<a name="trustx2-gdpr-usp-gpp"></a>

### GDPR, USP and GPP Support

The TrustX 2.0 adapter supports GDPR, US Privacy (CCPA), and Global Privacy Platform (GPP) consent signals.

The adapter will:
- Pass GDPR consent information to bid requests when available
- Pass US Privacy/CCPA consent strings when available
- Support GPP signals when provided
- Handle user data deletion requests according to privacy regulations
