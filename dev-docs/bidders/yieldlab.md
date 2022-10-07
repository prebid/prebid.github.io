---
layout: bidder
title: Yieldlab
description: Prebid Yieldlab Bidder Adapter
biddercode: yieldlab
media_types: video, banner, native
gdpr_supported: true
schain_supported: true
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId
prebid_member: true
pbjs: true
pbs: true
---



### Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                                                           | Example                                     | Type     |
|----------------|----------|---------------------------------------------------------------------------------------|---------------------------------------------|----------|
| `adslotId`     | required | Yieldlab Adslot ID                                                                    | `'12345'`                                   | `string` |
| `supplyId`     | required | Yieldlab Supply ID. Please reach out to your account management for more information. | `'12345'`                                   | `string` |
| `targeting`    | optional | Key-Value Targeting                                                                   | `{ 'key1': 'value1', 'key2': 'value2' }`    | `object` |
| `extId`        | optional | External Id                                                                           | `'abc'`                                     | `string` |
| `iabContent`   | optional | Object of content information, see [IAB Content Object](#iab_content) for details. It will override the content object passed in [First Party Data](https://docs.prebid.org/features/firstPartyData.html)    | `{ 'id': 'foo', 'title': 'bar' }`           | `object` |
| `customParams` | optional | Custom parameters to append to the query string of the bidding endpoint.              | `{ 'param': 'value1', 'param2': 'value2' }` | `object` |

<a name="iab_content" />

#### IAB Content Object

Yieldlab supports passing the IAB content object in correspond to the OpenRTB Specifications.
The following attributes are supported, and all of them are optional.

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                                                                   | Example                                     | Type             |
|----------------|----------|-----------------------------------------------------------------------------------------------|---------------------------------------------|------------------|
| `id`           | optional | Id uniquely identifying the content                                                           | `'12345'`                                   | `string`         |
| `episode`      | optional | Episode number                                                                                | `'42'`                                      | `string`         |
| `title`        | optional | Content title                                                                                 | `'some title'`                              | `string`         |
| `series`       | optional | Content series                                                                                | `'some series'`                             | `string`         |
| `season`       | optional | Content season                                                                                | `'s1'`                                      | `string`         |
| `artist`       | optional | Artist credited with the content                                                              | `'John Doe'`                                | `string`         |
| `genre`        | optional | Genre that best describes the content                                                         | `'some genre'`                              | `string`         |
| `isrc`         | optional | International Standard Recording Code conforming to ISO3901                                   | `'CC-XXX-YY-NNNNN'`                         | `string`         |
| `url`          | optional | URL of the content, for buy-side contextualization or review                                  | `'https://yieldlab.com'`                    | `string`         |
| `cat`          | optional | Array of IAB content categories that describe the content producer                            | `['IAB1-1', 'IAB1-2']`                      | `Array<string>`  |
| `context`      | optional | Type of content - 1: video, 2: game, 3: music, 4: application, 5: text, 6: other, 7: unknown  | `'7'`                                       | `string`         |
| `keywords`     | optional | Array of keywords describing the content                                                      | `['k1', 'k2', 'k3']`                        | `Array<string>`  |
| `live`         | optional | 0 = not live, 1 = content is live                                                             | `'0'`                                       | `string`         |
