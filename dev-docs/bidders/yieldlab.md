---
layout: bidder
title: Yieldlab
description: Prebid Yieldlab Bidder Adapter
biddercode: yieldlab
media_types: video, banner, native
tcfeu_supported: true
dsa_supported: true
schain_supported: true
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId
prebid_member: true
pbjs: true
pbs: true
pbs_app_supported: true
floors_supported: true
fpd_supported: true
ortb_blocking_supported: false
multiformat_supported: will-bid-on-any
deals_supported: true
gvl_id: 70
coppa_supported: false
usp_supported: false
sidebarType: 1
---



### Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                                                                                                                                                                                  | Example                                     | Type     |
|----------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------|----------|
| `adslotId`     | required | Yieldlab Adslot ID                                                                                                                                                                                           | `'12345'`                                   | `string` |
| `supplyId`     | required | Yieldlab Supply ID. Please reach out to your account management for more information.                                                                                                                        | `'12345'`                                   | `string` |
| `targeting`    | optional | Key-Value Targeting                                                                                                                                                                                          | `{ 'key1': 'value1', 'key2': 'value2' }`    | `object` |
| `extId`        | optional | External Id                                                                                                                                                                                                  | `'abc'`                                     | `string` |
| `iabContent`   | optional | Object of content information, see [IAB Content Object](#iab_content) for details. It will override the content object passed in [First Party Data](https://docs.prebid.org/features/firstPartyData.html)    | `{ 'id': 'foo', 'title': 'bar' }`           | `object` |
| `customParams` | optional | Custom parameters to append to the query string of the bidding endpoint.                                                                                                                                     | `{ 'param': 'value1', 'param2': 'value2' }` | `object` |

<a name="iab_content"></a>

#### IAB Content Object

Yieldlab supports passing the IAB content object according to section *3.2.16*
of the [OpenRTB 2.6 specification][openrtb-spec]. The following attributes are
supported, and all of them are optional:

* `id`
* `episode`
* `title`
* `series`
* `season`
* `artist`
* `genre`
* `album`
* `isrc`
* `producer`
  * `id`
  * `name`
  * `cattax`
  * `cat`
  * `domain`
* `url`
* `cattax`
* `cat`
* `prodq`
* `context`
* `contentrating`
* `userrating`
* `qagmediarating`
* `keywords`
* `livestream`
* `sourcerelationship`
* `len`
* `language`
* `embeddable`
* `data`
  * `id`
  * `name`
  * `segment`
    * `id`
    * `name`
    * `value`
    * `ext`
* `network`
  * `id`
  * `name`
  * `domain`
* `channel`
  * `id`
  * `name`
  * `domain`

[openrtb-spec]: https://iabtechlab.com/wp-content/uploads/2022/04/OpenRTB-2-6_FINAL.pdf
