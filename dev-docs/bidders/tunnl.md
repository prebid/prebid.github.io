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

Tunnl issues you a sid, and it is required on every ad unit. See
[Bid Params](#bid-params) before you go live.

For full functionality in GDPR territories, please ensure Tunnl is configured in
your CMP.

## Bid Params

{: .table .table-bordered .table-striped }

| Name  | Scope    | Description    | Example        | Type     |
|-------|----------|----------------|----------------|----------|
| `sid` | required | Your Tunnl sid | `'tunnl_x_g'`  | `string` |

```javascript
{
  bidder: 'tunnl',
  params: {
    sid: 'tunnl_x_g'
  }
}
```

Note:

* sid will be issued by Tunnl. Contact <prebid@tunnl.com> to get one.
* Use the same sid on every ad unit. The adapter sends one call per bid
  request, under the sid of the first impression.

## Multi-format Ad Units

Tunnl accepts banner, video and native, and will bid on any of the media types
present on an ad unit. If you define an ad unit with more than one media type,
Tunnl may return a bid for each of them, and the highest bid competes as usual.

## Testing

Contact <prebid@tunnl.com> to have test bids enabled for your sid. Remember to
disable them before going live.
