---
layout: bidder
title: Rumble Advertising Center
description: Prebid Rumble Bidder Adapter
biddercode: rumble
tcfeu_supported: false
dsa_supported: false
gvl_id: none
usp_supported: true
coppa_supported: false
gpp_sids: none
schain_supported: false
dchain_supported: false
media_types: video
safeframes_ok: true
floors_supported: true
fpd_supported: false
pbjs: true
pbs: false
prebid_member: false
multiformat_supported: will-bid-on-one
ortb_blocking_supported: false
privacy_sandbox: no
sidebarType: 1
---

### Note

To use the Rumble Advertising Center bidder, you need to have an existing Rumble Advertising Center account. To create a 
new account, see <https://ads.rumble.com>. For additional help, contact support or your account representative.

### Bid Params

{: .table .table-bordered .table-striped }

| Name        | Scope    | Description                                             | Example  | Type       |
|-------------|----------|---------------------------------------------------------|----------|------------|
| publisherId | required | Account publishing ID                                   | `1234`   | `number`   |  
| siteId      | required | The site ID you want to send requests                   | `123`    | `number`   |
| zoneId      | optional | An optional zone ID that you want to force requests to  | `12`     | `number`   |      
| test        | optional | An optional boolean flag for sending test requests      | `true`   | `boolean`  | 
