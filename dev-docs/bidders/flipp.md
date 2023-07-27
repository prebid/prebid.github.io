---
layout: bidder
title: flipp
description: Prebid Flipp Bidder Adapter
biddercode: flipp
media_types: banner
pbjs: false
pbs: true
tcfeu_supported: false
usp_supported: false
coppa_supported: false
schain_supported: false
floors_supported: false
userIds: none
prebid_member: false
safeframes_ok: true
deals_supported: false
pbs_app_supported: false
fpd_supported: false
multiformat_supported: will-not-bid
ortb_blocking_supported: false
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description  | Example   | Type     |
|---------------|----------|--------------|-----------|----------|
| `publisherNameIdentifier`      | required | Publisher name identifier | `test-publisher-name` | `string` |
| `creativeType` | required | Type of the creative | `NativeX` | `NativeX\|DTX` |
| `siteId` | required | ID associated with the site | `123456` | `integer` |
| `zoneIds` | optional | Zones to request from bidder | `[789, 123]` | `array[integer]` |
| `userKey` | optional | User Key to power experience optimization and frequency capping. Publishers: please confirm with legal counsel before using this feature. | `4188d8a3-22d1-49cb-8624-8838a22562bd` | `uuidv4` |
| `options` | optional | Additional integration specific context | `options: {   "startCompact": true }` | `map[string]interface{}` |

Current available integration options are as follows:

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description  | Example   | Type     |
|---------------|----------|--------------|-----------|----------|
| `startCompact`      | optional | Height of the experience will be reduced | `true` | `boolean` |
| `dwellExpand`      | optional | Auto expand the experience after a certain time passes | `true` | `boolean` |
| `contentCode`      | optional | Force show a certain experience. Generally used for testing and debugging purposes. | `publisher-test` | `string` |
