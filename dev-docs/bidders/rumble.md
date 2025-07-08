---
layout: bidder
title: Rumble Advertising Center
description: Prebid Rumble Bidder Adapter
biddercode: rumble
gvl_id: none
floors_supported: true
usp_supported: true
ortb_blocking_supported: false
media_types: video
multiformat_supported: will-bid-on-one
pbjs: true
pbs: false
safeframes_ok: true
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
