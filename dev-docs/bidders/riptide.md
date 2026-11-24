---
layout: bidder
title: Riptide
description: Prebid Riptide Bidder Adapter
biddercode: riptide
tcfeu_supported: false
gvl_id: none
dsa_supported: true
usp_supported: true
coppa_supported: true
gpp_sids: tcfeu, tcfca, usnat, usstate_all, usp
schain_supported: true
dchain_supported: false
userIds: all
media_types: banner, video, native, audio
safeframes_ok: true
deals_supported: true
floors_supported: true
fpd_supported: true
pbjs: true
pbs: true
pbs_app_supported: true
prebid_member: false
multiformat_supported: will-bid-on-one
ortb_blocking_supported: true
privacy_sandbox: no
sidebarType: 1
---

### Note

Riptide is an ad server, SSP and DSP. The adapter sends OpenRTB 2.6 to
`https://serve.riptideads.com/ortb`. Bids are typed by `mtype` and are net. Contact
[prebid@riptideads.com](mailto:prebid@riptideads.com) to set up a publisher account.

- Media types: Prebid.js sends banner, video (instream and outstream) and native. Prebid Server
  also sends audio, and DOOH requests. A multi-format ad unit is one imp, and Riptide returns at
  most one bid for it.
- Outstream video needs the publisher's own renderer (`mediaTypes.video.renderer`). The adapter
  returns VAST markup and no renderer.
- Consent: GDPR TCF, US Privacy, GPP, COPPA and DSA signals are passed through. No IAB TCF Global
  Vendor List id is registered for `riptide` yet, so where Prebid's TCF enforcement applies, EU
  traffic that requires consent is not sent to Riptide.
- User sync: an image sync (Prebid.js; an iframe only when image syncs are not allowed) or a
  redirect sync (Prebid Server) to `https://sync.riptideads.com/usersync`. The Prebid.js adapter
  stores nothing in the browser.

### Bid Params

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description                                              | Example        | Type     |
|---------------|----------|----------------------------------------------------------|----------------|----------|
| `publisherId` | required | The publisher's public id in Riptide                     | `'pub1'`       | `string` |
| `placementId` | required | The placement's public id (sent as `imp.tagid`)          | `'tag-direct'` | `string` |
| `bidfloor`    | optional | Floor in USD CPM. The price floors module's floor wins.  | `0.25`         | `number` |

The same params apply to Prebid.js and Prebid Server.

### Partner aliases

A partner running on Riptide bids under its own bidder code, an alias of `riptide` with its own
serving and sync hosts. Use the partner's code as the `bidder`. Only codes the adapter knows have
an endpoint, so don't create a new alias of `riptide` with `pbjs.aliasBidder`. Alias user syncs
in Prebid.js need `pbjs.setConfig({ userSync: { aliasSyncEnabled: true } })`.
