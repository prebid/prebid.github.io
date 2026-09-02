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
privacy_sandbox: no
endpoint_compression: true
pbjs: false
pbs: true
pbs_app_supported: true
sidebarType: 1
---

## Before You Begin

Tunnl is available through Prebid Server. For questions or setup help, contact
<prebid@tunnl.com>.

Every request you send to Tunnl must carry an `ext.source` value identifying
your integration. See
[Required Partner Identification](#required-partner-identification) before you
go live.

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

Note that this refers to bid parameters only. Your integration must still
identify itself on the bid request, as described below.

## Required Partner Identification

Every request you send to Tunnl must carry an `ext.source` value at the top
level of the OpenRTB request. This is how we attribute revenue to your
integration:

```json
{
  "ext": {
    "source": "your-company-name"
  }
}
```

Pick any value that identifies you, such as your company name in lower case.
There is nothing to request from us and no identifier to generate. Once you
have picked a value, send that same value on every request for the lifetime of
the integration: it is the key your revenue is grouped by, so varying it or
changing it later splits your reporting.

Requests that omit the field still receive bids, and no error is returned, so a
missing `ext.source` is easy to overlook. Confirm the field is present on your
live traffic, and contact <prebid@tunnl.com> if you are unsure.

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
