---
layout: bidder
title: flipp
description: Prebid Flipp Bidder Adapter
biddercode: flipp
media_types: banner
safeframes_ok: true
pbjs: true
pbs: true
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description  | Example   | Type     |
|---------------|----------|--------------|-----------|----------|
| `publisherNameIdentifier`      | required | Publisher name identifier | `test-publisher-name` | `string` |
| `creativeType` | required | Type of the creative | `NativeX` | `NativeX\|DTX` |
| `siteId` | required | ID associated with the site | `123456` | `integer` |
| `zoneIds` | optional | Zones to request from bidder | `[789, 123]` | `array[integer]` |
| `userKey` | optional | User Key to power experience optimization and frequency capping | `4188d8a3-22d1-49cb-8624-8838a22562bd` | `uuidv4` |
| `options` | optional | Options object to control features | `options: {   "startCompact": true }` | `map[string]interface{}` |

Current available integration options are as follows:

| Name          | Scope    | Description  | Example   | Type     |
|---------------|----------|--------------|-----------|----------|
| `startCompact`      | optional | Height of the experience will be reduced | `true` | `boolean` |
