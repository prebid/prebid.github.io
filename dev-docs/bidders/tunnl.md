---
layout: bidder
title: Tunnl
description: Prebid Tunnl Bidder Adapter
biddercode: tunnl
media_types: banner, video, native
multiformat_supported: will-bid-on-any
gvl_id: 540
tcfeu_supported: true
usp_supported: false
coppa_supported: false
schain_supported: false
dchain_supported: false
dsa_supported: false
fpd_supported: false
deals_supported: false
floors_supported: false
safeframes_ok: true
prebid_member: false
ortb_blocking_supported: false
endpoint_compression: true
pbjs: false
pbs: true
pbs_app_supported: true
sidebarType: 1
---

## Before You Begin

Tunnl is available through Prebid Server. For questions or setup help, contact
<prebid@tunnl.com>.

For full functionality in GDPR territories, please ensure Tunnl is configured in
your CMP.

## Bid Params

Tunnl does not require any bid parameters. Everything needed to serve a bid is
taken from the standard OpenRTB request, so an empty params object is all you
need:

```javascript
{
  bidder: 'tunnl',
  params: {}
}
```

{: .table .table-bordered .table-striped }

| Name   | Scope    | Description                     | Example | Type |
|--------|----------|---------------------------------|---------|------|
| (none) | optional | No bid parameters are required. | `{}`    | n/a  |

## Multi-format Ad Units

Tunnl accepts banner, video and native, and will bid on any of the media types
present on an ad unit. If you define an ad unit with more than one media type,
Tunnl may return a bid for each of them, and the highest bid competes as usual.

## Testing

To receive test bids, set the OpenRTB `test` flag on your Prebid Server request:

```json
{
  "test": 1
}
```

Test bids are returned for each supported media type. Remember to remove the
flag before going live.
